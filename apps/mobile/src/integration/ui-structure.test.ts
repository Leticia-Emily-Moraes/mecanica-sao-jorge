import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const SRC = join(__dirname, '..');
const APP = join(SRC, '..', 'app');
const COMPONENTS = join(SRC, 'components');
const SCREENS = join(SRC, 'screens');

function listDirectories(dir: string): readonly string[] {
  return readdirSync(dir).filter((name) => statSync(join(dir, name)).isDirectory());
}

function listFilesRecursively(dir: string): readonly string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFilesRecursively(path) : [path];
  });
}

const componentFolders = listDirectories(COMPONENTS).flatMap((group) =>
  listDirectories(join(COMPONENTS, group)).map((name) => ({
    group,
    name,
    dir: join(COMPONENTS, group, name),
  })),
);

describe('ui-structure (ADR-015)', () => {
  it('should have a folder per component when listing src/components groups', () => {
    const looseFiles = listDirectories(COMPONENTS).flatMap((group) =>
      readdirSync(join(COMPONENTS, group)).filter(
        (name) => !name.startsWith('.') && !statSync(join(COMPONENTS, group, name)).isDirectory(),
      ),
    );

    expect(looseFiles).toEqual([]);
  });

  it('should have component file and index when reading each component folder', () => {
    const missing = componentFolders.flatMap(({ group, name, dir }) =>
      [`${name}.tsx`, 'index.ts']
        .filter((file) => !existsSync(join(dir, file)))
        .map((file) => `${group}/${name}/${file}`),
    );

    expect(componentFolders.length).toBeGreaterThan(0);
    expect(missing).toEqual([]);
  });

  it('should have a styles file next to the component when the folder renders UI', () => {
    // Componente que só compõe outros (nenhuma prop `style` ou `*Style` no JSX) não tem estilo próprio.
    const missing = componentFolders
      .filter(({ name, dir }) => /[sS]tyle=\{/.test(readFileSync(join(dir, `${name}.tsx`), 'utf8')))
      .filter(({ name, dir }) => !existsSync(join(dir, `${name}.styles.ts`)))
      .map(({ group, name }) => `${group}/${name}`);

    expect(missing).toEqual([]);
  });

  it('should keep styles file inside its component folder when searching src', () => {
    const stray = listFilesRecursively(SRC)
      .filter((path) => path.endsWith('.styles.ts'))
      .filter((path) => {
        const parts = path.split('/');
        const file = parts[parts.length - 1] ?? '';
        const folder = parts[parts.length - 2] ?? '';
        return file !== `${folder}.styles.ts` || !existsSync(join(path, '..', `${folder}.tsx`));
      });

    expect(stray).toEqual([]);
  });

  it('should have a screen file named after its folder when reading src/screens', () => {
    const folders = listDirectories(SCREENS);
    const missing = folders.filter(
      (name) => !existsSync(join(SCREENS, name, `${name}-screen.tsx`)),
    );

    expect(folders.length).toBeGreaterThan(0);
    expect(missing).toEqual([]);
  });

  it('should not have tests or styles inside app when reading the routes folder', () => {
    const offenders = listFilesRecursively(APP).filter(
      (path) => /\.(test|spec|styles)\.[jt]sx?$/.test(path) || path.endsWith('.styles.ts'),
    );

    expect(offenders).toEqual([]);
  });
});

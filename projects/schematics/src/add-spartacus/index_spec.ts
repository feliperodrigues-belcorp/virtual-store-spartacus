import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('add-spartacus', () => {
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  const workspaceOptions: any = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '0.5.0',
  };

  const appOptions: any = {
    name: 'schematics-test',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'scss',
    skipTests: false,
  };

  const defaultOptions = {
    project: 'schematics-test',
    target: 'build',
    configuration: 'production',
  };

  beforeEach(async () => {
    appTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        workspaceOptions
      )
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        appOptions,
        appTree
      )
      .toPromise();
  });

  it('should add spartacus deps', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('add-spartacus', defaultOptions, appTree)
      .toPromise();
    const packageJson = tree.readContent('/package.json');
    const packageObj = JSON.parse(packageJson);
    const depPackageList = Object.keys(packageObj.dependencies);
    expect(depPackageList.includes('@spartacus/core')).toBe(true);
    expect(depPackageList.includes('@spartacus/storefront')).toBe(true);
    expect(depPackageList.includes('@spartacus/styles')).toBe(true);
  });

  it('Add PWA/ServiceWorker support for your project', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('add-spartacus', defaultOptions, appTree)
      .toPromise();
    const packageJson = tree.readContent('/package.json');
    const packageObj = JSON.parse(packageJson);
    const depPackageList = Object.keys(packageObj.dependencies);
    expect(depPackageList.includes('@angular/service-worker')).toBe(true);
    expect(
      tree.files.includes('/projects/schematics-test/src/manifest.webmanifest')
    ).toBe(true);
    expect(
      tree.files.includes(
        '/projects/schematics-test/src/assets/icons/icon-96x96.png'
      )
    ).toBe(true);
  });

  it('Import Spartacus modules in app.module', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('add-spartacus', defaultOptions, appTree)
      .toPromise();
    const appModule = tree.readContent(
      '/projects/schematics-test/src/app/app.module.ts'
    );
    expect(
      appModule.includes(
        `import { B2cStorefrontModule, defaultCmsContentConfig } from '@spartacus/storefront';`
      )
    ).toBe(true);
    expect(appModule.includes('B2cStorefrontModule.withConfig')).toBe(true);
  });

  describe('Setup configuration', () => {
    it('should set baseUrl', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'add-spartacus',
          { ...defaultOptions, baseUrl: 'test-url' },
          appTree
        )
        .toPromise();
      const appModule = tree.readContent(
        '/projects/schematics-test/src/app/app.module.ts'
      );
      expect(appModule.includes(`baseUrl: 'test-url'`)).toBe(true);
    });

    it('should set baseSite', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'add-spartacus',
          { ...defaultOptions, baseSite: 'test-site' },
          appTree
        )
        .toPromise();
      const appModule = tree.readContent(
        '/projects/schematics-test/src/app/app.module.ts'
      );
      expect(appModule.includes(`baseSite: ['test-site']`)).toBe(true);
    });
  });

  it('Import Spartacus styles to main.scss', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('add-spartacus', defaultOptions, appTree)
      .toPromise();
    const stylesFile = tree.readContent(
      '/projects/schematics-test/src/styles.scss'
    );
    expect(stylesFile.includes(`@import '~@spartacus/styles/index';`)).toBe(
      true
    );
  });

  it('Add cx-storefront component to your app.component', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('add-spartacus', defaultOptions, appTree)
      .toPromise();
    const appComponentTemplate = tree.readContent(
      '/projects/schematics-test/src/app/app.component.html'
    );
    expect(
      appComponentTemplate.includes(`<cx-storefront></cx-storefront>`)
    ).toBe(true);
  });

  describe('Update index.html', async () => {
    it('should not add meta tags by default', async () => {
      const tree = await schematicRunner
        .runSchematicAsync('add-spartacus', defaultOptions, appTree)
        .toPromise();
      const indexHtmlFile = tree.readContent(
        '/projects/schematics-test/src/index.html'
      );
      expect(indexHtmlFile.includes(`<meta name="occ-backend-base-url"`)).toBe(
        false
      );
      expect(
        indexHtmlFile.includes(`<meta name="media-backend-base-url"`)
      ).toBe(false);
    });

    it('should add meta tags', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'add-spartacus',
          { ...defaultOptions, useMetaTags: true },
          appTree
        )
        .toPromise();
      const indexHtmlFile = tree.readContent(
        '/projects/schematics-test/src/index.html'
      );
      expect(
        indexHtmlFile.includes(
          `<meta name="occ-backend-base-url" content="OCC_BACKEND_BASE_URL_VALUE" />`
        )
      ).toBe(true);
      expect(
        indexHtmlFile.includes(
          `<meta name="media-backend-base-url" content="MEDIA_BACKEND_BASE_URL_VALUE" />`
        )
      ).toBe(true);
    });

    it('should set baseUrl in meta tag', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'add-spartacus',
          { ...defaultOptions, useMetaTags: true, baseUrl: 'test-url' },
          appTree
        )
        .toPromise();
      const indexHtmlFile = tree.readContent(
        '/projects/schematics-test/src/index.html'
      );
      const appModule = tree.readContent(
        '/projects/schematics-test/src/app/app.module.ts'
      );
      expect(
        indexHtmlFile.includes(
          `<meta name="occ-backend-base-url" content="test-url" />`
        )
      ).toBe(true);
      expect(appModule.includes(`baseUrl:`)).toBe(false);
    });
  });
});

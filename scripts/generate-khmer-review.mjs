/**
 * Builds khmer-translation-review.json for vector-addition.
 * Prefills overlapping sim strings + joist/scenery-phet chrome from
 * vector-addition-equations review when available; leaves the rest empty.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const simRoot = path.resolve( __dirname, '..' );
const workspace = path.resolve( simRoot, '..' );
const eqsReviewPath = path.resolve(
  workspace, '..', 'vector-addition-equations', 'vector-addition-equations', 'khmer-translation-review.json'
);

const en = JSON.parse( fs.readFileSync( path.join( simRoot, 'vector-addition-strings_en.json' ), 'utf8' ) );
const eqs = JSON.parse( fs.readFileSync( eqsReviewPath, 'utf8' ) );

function flatValues( obj, prefix = '' ) {
  const out = {};
  if ( obj && typeof obj === 'object' ) {
    if ( typeof obj.value === 'string' ) {
      out[ prefix ] = obj.value;
    }
    else {
      for ( const [ k, v ] of Object.entries( obj ) ) {
        if ( [ 'simMetadata', '_comment', 'deprecated' ].includes( k ) ) {
          continue;
        }
        const key = prefix ? `${prefix}.${k}` : k;
        Object.assign( out, flatValues( v, key ) );
      }
    }
  }
  return out;
}

const flat = flatValues( en );

// Build lookup of previously translated vector-addition strings from equations review
const prior = {};
for ( const section of [ 'sim_visible_ui', 'sim_a11y' ] ) {
  const block = eqs[ section ] || {};
  for ( const [ key, entry ] of Object.entries( block ) ) {
    if ( entry.source === 'vector-addition' || !entry.source ) {
      // Normalize equations-title key vs vector-addition title
      prior[ key ] = entry;
    }
  }
}

const visibleCategories = {
  'vector-addition.title': 'title',
  'screen.equations': 'screen_name',
  'screen.explore1D': 'screen_name',
  'screen.explore2D': 'screen_name',
  'screen.lab': 'screen_name',
  sum: 'checkbox_control',
  values: 'checkbox_control',
  components: 'label',
  noVectorSelected: 'status_message',
  vectorValues: 'accordion_box',
  'symbol.x': 'axis_symbol',
  'symbol.y': 'axis_symbol',
  baseVectors: 'accordion_box',
  equation: 'accordion_box',
  angleConvention: 'preferences',
  angleConventionDescription: 'preferences',
  signedRange: 'preferences',
  unsignedRange: 'preferences',
  'keyboardHelpDialog.graphAreaOrigin': 'keyboard_help',
  'keyboardHelpDialog.vectors': 'keyboard_help',
  'keyboardHelpDialog.removeFromGraphArea': 'keyboard_help',
  'keyboardHelpDialog.selectOrDeselect': 'keyboard_help',
  'keyboardHelpDialog.moveVector': 'keyboard_help',
  'keyboardHelpDialog.scaleRotateVector': 'keyboard_help',
  'keyboardHelpDialog.checkVectorValues': 'keyboard_help'
};

const visibleNotes = {
  'vector-addition.title': 'Sim title on home screen / browser tab.',
  'screen.explore1D': 'Home screen card + navbar for Explore 1D.',
  'screen.explore2D': 'Home screen card + navbar for Explore 2D.',
  'screen.lab': 'Home screen card + navbar for Lab.',
  'screen.equations': 'Home screen card + navbar for Equations (equation practice / manipulation).',
  sum: 'Sum checkbox label on control panel (Explore/Lab screens).',
  values: 'Values checkbox label on control panel.',
  components: 'Components control label on control panel.',
  noVectorSelected: 'Shown in Vector Values accordion when nothing selected.',
  vectorValues: 'Vector Values accordion box title.',
  'symbol.x': 'X axis / component symbol. Often keep as x.',
  'symbol.y': 'Y axis / component symbol. Often keep as y.',
  baseVectors: 'Base Vectors accordion box title (Equations screen).',
  equation: 'Equation accordion box title (Equations screen).',
  angleConvention: 'Preferences → Simulation: Angle Convention control label.',
  angleConventionDescription: 'Preferences → Simulation: description under Angle Convention.',
  signedRange: 'Preferences radio: signed angle range. Keep degree symbol °.',
  unsignedRange: 'Preferences radio: unsigned angle range. Keep degree symbol °.',
  'keyboardHelpDialog.graphAreaOrigin': 'Keyboard Shortcuts dialog section title.',
  'keyboardHelpDialog.vectors': 'Keyboard Shortcuts dialog section title.',
  'keyboardHelpDialog.removeFromGraphArea': 'Keyboard shortcut description.',
  'keyboardHelpDialog.selectOrDeselect': 'Keyboard shortcut description.',
  'keyboardHelpDialog.moveVector': 'Keyboard shortcut description (Move vector).',
  'keyboardHelpDialog.scaleRotateVector': 'Keyboard shortcut description.',
  'keyboardHelpDialog.checkVectorValues': 'Keyboard shortcut description.'
};

const sim_visible_ui = {};
const sim_a11y = {};

for ( const [ key, english ] of Object.entries( flat ) ) {
  const isA11y = key.startsWith( 'a11y.' );
  const entry = {
    english,
    khmer: '',
    category: isA11y ? 'a11y' : ( visibleCategories[ key ] || 'ui' )
  };

  if ( isA11y ) {
    entry.notes =
      'Screen-reader / accessible name or help text. Keep Fluent placeholders like { $symbol } / { $equationType -> ... } unchanged.';
    // Optional hint: prior Khmer exists for Equations-overlap keys in vector-addition-equations review
    if ( prior[ key ]?.khmer ) {
      entry.notes += ' (Hint: similar string already translated in vector-addition-equations review — optional reuse.)';
    }
  }
  else if ( visibleNotes[ key ] ) {
    entry.notes = visibleNotes[ key ];
  }

  if ( isA11y ) {
    sim_a11y[ key ] = entry;
  }
  else {
    sim_visible_ui[ key ] = entry;
  }
}

const shared_joist_chrome = structuredClone( eqs.shared_joist_chrome );
const shared_scenery_phet_chrome = structuredClone( eqs.shared_scenery_phet_chrome );

const emptySimVisible = Object.values( sim_visible_ui ).filter( e => !e.khmer ).length;
const emptyA11y = Object.values( sim_a11y ).filter( e => !e.khmer ).length;
const emptyJoist = Object.values( shared_joist_chrome ).filter( e => !e.khmer ).length;
const emptyScenery = Object.values( shared_scenery_phet_chrome ).filter( e => !e.khmer ).length;

const review = {
  meta: {
    project: 'vector-addition',
    fork: 'https://github.com/krumath-org/vector-addition',
    source_en_files: [
      'vector-addition/vector-addition-strings_en.json',
      'joist/joist-strings_en.json',
      'scenery-phet/scenery-phet-strings_en.json'
    ],
    locale_target: 'km',
    generated: '2026-10-04',
    how_to_fill: [
      'Fill empty "khmer" fields. Do not rename keys or change "english".',
      'Keep placeholders {{likeThis}}, {0}, and Fluent forms like { $symbol } / { $equationType -> ... } unchanged inside Khmer text.',
      'Keep degree symbol ° in signedRange / unsignedRange.',
      'PRIORITY 1 — sim_visible_ui: title, Explore 1D / Explore 2D / Lab / Equations screens, Sum/Values/Components, accordion titles, Preferences Angle Convention, keyboard-help labels (all EMPTY — please translate).',
      'PRIORITY 1b — sim_a11y: screen-reader strings for all screens (including Angles/Grid accessible names, scene names Horizontal/Vertical/Cartesian/Polar, equation radios, etc.). Optional for first pass if you only want on-screen text; fill when ready. All EMPTY.',
      'PRIORITY 2 — shared_joist_chrome / shared_scenery_phet_chrome: PhET menu, About/Credits, Preferences tabs, Reset All (prefilled from vector-addition-equations — review/adjust).',
      'Screens: Explore 1D, Explore 2D, Lab, Equations (equation practice). Home/nav chrome uses joist strings.',
      'Icon-only controls (Angles, Grid, Base Vectors checkbox, Components style icons) show English mainly via a11y names in sim_a11y.',
      'symbol.x / symbol.y are usually kept as x / y.',
      'Backend/dev-only strings omitted (credits person names stay as proper names).',
      'Send this file back when ready; we will apply into babel as vector-addition-strings_km.json (+ joist/scenery-phet as needed).'
    ],
    counts: {
      sim_visible_ui: Object.keys( sim_visible_ui ).length,
      sim_a11y: Object.keys( sim_a11y ).length,
      shared_joist_chrome: Object.keys( shared_joist_chrome ).length,
      shared_scenery_phet_chrome: Object.keys( shared_scenery_phet_chrome ).length,
      total:
        Object.keys( sim_visible_ui ).length +
        Object.keys( sim_a11y ).length +
        Object.keys( shared_joist_chrome ).length +
        Object.keys( shared_scenery_phet_chrome ).length,
      empty_khmer_needing_translation: emptySimVisible + emptyA11y + emptyJoist + emptyScenery,
      empty_priority1_sim_visible_ui: emptySimVisible,
      empty_priority1b_sim_a11y: emptyA11y
    }
  },
  sim_visible_ui,
  sim_a11y,
  shared_joist_chrome,
  shared_scenery_phet_chrome
};

const outPath = path.join( simRoot, 'khmer-translation-review.json' );
fs.writeFileSync( outPath, `${JSON.stringify( review, null, 2 )}\n`, 'utf8' );
console.log( `Wrote ${outPath}` );
console.log( JSON.stringify( review.meta.counts, null, 2 ) );
console.log( 'Empty sim_visible_ui keys:' );
for ( const [ k, v ] of Object.entries( sim_visible_ui ) ) {
  if ( !v.khmer ) {
    console.log( `  - ${k}: ${v.english}` );
  }
}

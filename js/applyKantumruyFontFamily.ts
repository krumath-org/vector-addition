// Copyright 2026, University of Colorado Boulder

/**
 * Apply Kantumruy Pro as the sim-wide PhetFont family before other modules load.
 *
 * PhetFont snapshots sceneryPhetQueryParameters.fontFamily at construction time.
 * Module-level fonts are created during import, so this file must be the first
 * import from vector-addition-main.ts.
 *
 * Also overrides the home-screen title family, which hardcodes Century Gothic/Futura
 * and ignores SimOptions.
 *
 * @author KruMath localization
 */

import HomeScreenView from '../../joist/js/HomeScreenView.js';
import sceneryPhetQueryParameters from '../../scenery-phet/js/sceneryPhetQueryParameters.js';

sceneryPhetQueryParameters.fontFamily = 'Kantumruy Pro';

// TITLE_FONT_FAMILY is typed readonly but is a mutable runtime class property.
( HomeScreenView as unknown as { TITLE_FONT_FAMILY: string } ).TITLE_FONT_FAMILY = 'Kantumruy Pro';

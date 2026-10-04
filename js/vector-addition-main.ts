// Copyright 2019-2026, University of Colorado Boulder

/**
 * Main entry point for the 'Vector Addition' sim.
 *
 * @author Martin Veillette
 */

// Must be first: sets Kantumruy Pro before any PhetFont is constructed at import time.
import './applyKantumruyFontFamily.js';

import localeProperty from '../../joist/js/i18n/localeProperty.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { type SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import { combineOptions } from '../../phet-core/js/optionize.js';
import Tandem from '../../tandem/js/Tandem.js';
import VectorAdditionPreferences from './common/model/VectorAdditionPreferences.js';
import VectorAdditionConstants from './common/VectorAdditionConstants.js';
import VectorAdditionPreferencesNode from './common/view/VectorAdditionPreferencesNode.js';
import createLanguageSwitch from './createLanguageSwitch.js';
import EquationsScreen from './equations/EquationsScreen.js';
import Explore1DScreen from './explore1D/Explore1DScreen.js';
import Explore2DScreen from './explore2D/Explore2DScreen.js';
import LabScreen from './lab/LabScreen.js';
import VectorAdditionFluent from './VectorAdditionFluent.js';

const launchSimulation = (): void => {

  // Khmer is the default locale for this KruMath fork.
  localeProperty.value = 'km';

  const titleStringProperty = VectorAdditionFluent[ 'vector-addition' ].titleStringProperty;

  const screens = [
    new Explore1DScreen( Tandem.ROOT.createTandem( 'explore1DScreen' ) ),
    new Explore2DScreen( Tandem.ROOT.createTandem( 'explore2DScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) ),
    new EquationsScreen( Tandem.ROOT.createTandem( 'equationsScreen' ) )
  ];

  const options = combineOptions<SimOptions>( {}, {
    phetioDesigned: true,
    credits: VectorAdditionConstants.CREDITS,

    // Preferences
    preferencesModel: new PreferencesModel( {
      simulationOptions: {
        customPreferences: [ {
          createContent: tandem => new VectorAdditionPreferencesNode( VectorAdditionPreferences.instance, tandem )
        } ]
      }
    } ),

    // CAV-style ខ្មែរ | English switch on the home screen
    homeScreenWarningNode: createLanguageSwitch()
  } );

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
};

const kantumruyFont = new FontFace(
  'Kantumruy Pro',
  `url(${new URL( 'images/KantumruyProKhmer.woff2', window.location.href )})`,
  { weight: '100 900' }
);

kantumruyFont.load().then( loadedFont => {
  document.fonts.add( loadedFont );
  simLauncher.launch( launchSimulation );
} ).catch( error => {
  console.error( 'Unable to load Kantumruy Pro; using the default font.', error );
  simLauncher.launch( launchSimulation );
} );

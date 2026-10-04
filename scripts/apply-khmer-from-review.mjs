/**
 * Apply khmer-translation-review.json → babel *-strings_km.json
 * and patch babel/_generated_development_strings/*_all.json so unbuilt
 * mode can switch to Khmer at runtime.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '../..' );
const reviewPath = path.join( root, 'vector-addition', 'khmer-translation-review.json' );
const review = JSON.parse( fs.readFileSync( reviewPath, 'utf8' ) );

const toBabelFlat = entries => {
  const out = {};
  for ( const [ key, { khmer } ] of Object.entries( entries ) ) {
    if ( khmer === undefined || khmer === null || String( khmer ).trim() === '' ) {
      throw new Error( `Missing khmer for key: ${key}` );
    }
    out[ key ] = { value: khmer };
  }
  return out;
};

const writeBabel = ( repo, fileName, obj ) => {
  const dir = path.join( root, 'babel', repo );
  fs.mkdirSync( dir, { recursive: true } );
  const filePath = path.join( dir, fileName );
  fs.writeFileSync( filePath, `${JSON.stringify( obj, null, 2 )}\n`, 'utf8' );
  console.log( 'Wrote', filePath, `(${Object.keys( obj ).length} keys)` );
};

const patchAllJson = ( repo, kmFlat ) => {
  const allPath = path.join( root, 'babel', '_generated_development_strings', `${repo}_all.json` );
  if ( !fs.existsSync( allPath ) ) {
    throw new Error( `Missing conglomerate strings file: ${allPath}` );
  }
  const all = JSON.parse( fs.readFileSync( allPath, 'utf8' ) );
  // Flatten values into the conglomerate shape: { key: { value } }
  all.km = { ...( all.km || {} ), ...kmFlat };
  fs.writeFileSync( allPath, `${JSON.stringify( all, null, 2 )}\n`, 'utf8' );
  console.log( 'Patched', allPath, `km keys now: ${Object.keys( all.km ).length}` );
};

const simKm = {
  ...toBabelFlat( review.sim_visible_ui ),
  ...toBabelFlat( review.sim_a11y )
};
writeBabel( 'vector-addition', 'vector-addition-strings_km.json', simKm );
patchAllJson( 'vector-addition', simKm );

const joistKm = toBabelFlat( review.shared_joist_chrome );
writeBabel( 'joist', 'joist-strings_km.json', joistKm );
patchAllJson( 'joist', joistKm );

const sceneryPath = path.join( root, 'babel', 'scenery-phet', 'scenery-phet-strings_km.json' );
let sceneryKm = {};
if ( fs.existsSync( sceneryPath ) ) {
  sceneryKm = JSON.parse( fs.readFileSync( sceneryPath, 'utf8' ) );
}
Object.assign( sceneryKm, toBabelFlat( review.shared_scenery_phet_chrome ) );
writeBabel( 'scenery-phet', 'scenery-phet-strings_km.json', sceneryKm );
patchAllJson( 'scenery-phet', sceneryKm );

console.log( 'Done applying Khmer strings.' );

import React from 'react';
import Paper from 'material-ui/lib/paper';
import { createSelector } from 'reselect';
import { Localization } from 'keysavcore';
import backgroundColors from './background-colors.json';
import sprites from '../../../resources/sprites.json';
import spritesheetPath from 'file!../../../resources/sprites.png';
import styles from './PkmListPretty.module.scss';

const spritesheetUrl = `url(${spritesheetPath})`;
const spritesheetSize = `${sprites.width * 0.8}px ${sprites.height * 0.8}px`;

const ivNames = ['Hp', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spe'];
const genderStyles = [styles.genderMale, styles.genderFemale, styles.genderNeutral];

function getIvClass(pkm, iv) {
  const val = pkm['iv' + iv];
  if (iv === 'Spe' && pkm.nature % 5 === 2) {
    if (31 - val <= 1) {
      return styles.ivBad;
    }

    if (val <= 1) {
      return styles.ivGood;
    }
  }
  if (31 - val <= 1) {
    return styles.ivGood;
  }

  if (val <= 1) {
    return styles.ivBad;
  }

  return '';
}

function pad2(n) {
  return ('00' + n).slice(-2);
}
function pad3(n) {
  return ('000' + n).slice(-3);
}
function pad4(n) {
  return ('0000' + n).slice(-4);
}

function getSprite(pkm) {
  const sprite = pkm.species + (pkm.form ? '-' + pkm.form : '') + (pkm.tsv === pkm.esv ? '-s' : '');
  if (backgroundColors[sprite]) {
    return sprite;
  }
  return '' + pkm.species + (pkm.tsv === pkm.esv ? '-s' : '');
}

function getSpecies(pkm, local) {
  if (pkm.form && local.forms[pkm.species] && local.forms[pkm.species][pkm.form]) {
    return local.species[pkm.species] + ' (' + local.forms[pkm.species][pkm.form] + ')';
  }
  return local.species[pkm.species];
}

export default class PkmListPretty extends React.Component {
  static propTypes = {
    pokemon: React.PropTypes.object,
    language: React.PropTypes.string,
    format: React.PropTypes.object
  };

  getPokemon = createSelector(
    () => this.props.format.ghosts === 'hide',
    () => this.props.pokemon,
    (hideGhosts, pokemon) => {
      const pkm = hideGhosts ? pokemon.filter(e => !e.isGhost) : pokemon;
      return pkm.map(this.renderPokemon);
    }
  )

  renderPokemon = (pkm) => {
    const local = Localization[this.props.language];
    const sprite = getSprite(pkm);
    const spriteClass = sprites.sprites[sprite];
    return (
      <Paper key={pkm.box * 30 + pkm.slot} className={`${styles.paper} ${pkm.isGhost && this.props.format.ghosts === 'mark' ? styles.ghost : ''}`}>
        <div className={styles.sprite}
          style={{ backgroundColor: backgroundColors[sprite] }}
        ><div style={{
          width: '80px',
          height: '80px',
          backgroundPosition: `${spriteClass.x * 0.8}px ${spriteClass.y * 0.8}px`,
          backgroundImage: spritesheetUrl,
          backgroundSize: spritesheetSize
        }}
        /></div>
        <div className={styles.infoSide}>
          <div className={styles.nameLine}>
            <div>
              <div className={styles.box}><span className={styles.boxName}>Box </span>{pad2(pkm.box + 1)} - {Math.floor(pkm.slot / 6) + 1},{pkm.slot % 6 + 1}</div>
              <div>
                <span className={styles.dexNo}><span className={styles.dexHash}>#</span>{pad3(pkm.species)}</span>&nbsp;
                <span className={genderStyles[pkm.gender]}>{getSpecies(pkm, local)}</span>
              </div>
            </div>
            <div className={styles.nameColumn}>
              <div>
                <div>OT</div><div className={genderStyles[pkm.otGender]}>{pkm.ot}</div>
              </div>
              <div>
                <div>Nickname</div><div>{pkm.nickname}</div>
              </div>
            </div>
            <div className={styles.nameColumn}>
              <div>
                <div>Nature</div><div>{local.natures[pkm.nature]}</div>
              </div>
              <div>
                <div>Ability</div><div>{local.abilities[pkm.ability]}</div>
              </div>
            </div>

            <span className={styles.langTag}>{local.languageTags[pkm.otLang]}</span>
          </div>
          <div className={styles.ivLine}>
            {ivNames.map((iv, i) =>
              <div className={`${styles.ivBox} ${getIvClass(pkm, iv)}`} key={i}>
                <span className={styles.ivName}>{iv}</span>
                <span className={styles.ivValue}>{pkm['iv' + iv]}</span>
              </div>
            )}
            <div className={styles.esvBox}>
              <span className={styles.esvName}>ESV</span>
              <span className={styles.esvValue}>{pad4(pkm.esv)}</span>
            </div>
          </div>
        </div>
      </Paper>
    );
  }

  /*
  Include:
  - Ball?
  - HP Type
  */
  render() {
    return (
      <div>
        {this.getPokemon()}
      </div>
    );
  }
}
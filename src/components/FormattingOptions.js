import PropTypes from 'prop-types';
import React from 'react';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import IconButton from 'material-ui/IconButton';
import CreateIcon from 'material-ui/svg-icons/content/create';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import LockedIcon from 'material-ui/svg-icons/action/lock';
import CreateFormattingOption from './CreateFormattingOption';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import { Seq } from 'immutable';
import styles from './FormattingOptions.module.scss';

const languages = [
  <MenuItem key={1} value="en" primaryText="English" />,
  <MenuItem key={2} value="ja" primaryText="Japanese" />,
  <MenuItem key={3} value="de" primaryText="German" />,
  <MenuItem key={4} value="fr" primaryText="French" />,
  <MenuItem key={5} value="it" primaryText="Italian" />,
  <MenuItem key={6} value="es" primaryText="Spanish" />,
  <MenuItem key={7} value="ko" primaryText="Korean" />,
  <MenuItem key={8} value="zh" primaryText="Chinese" />,
];

const FormattingOptions = ({
  language,
  changeFormatLanguage,
  formattingOptions,
  current,
  currentIndex,
  plugins,
  addFormattingOption,
  cloneCurrentFormattingOption,
  updateCurrentFormattingOption,
  updateFormattingOption,
  selectFormattingOption,
  deleteCurrentFormattingOption,
  changeCurrentFormattingOptionName,
}) => (
  <Paper className={styles.paper}>
    <h2>Formatting</h2>
    <div className={styles.topRow}>
      <SelectField
        onChange={(e, i, v) => changeFormatLanguage(v)}
        value={language}
        floatingLabelText="Language"
        className={styles.languageSelector}
        style={{ width: '120px', marginRight: '15px' }}
      >
        {languages}
      </SelectField>
      <SelectField
        value={currentIndex}
        onChange={(e, i, v) => selectFormattingOption(v)}
        floatingLabelText="Formatting Option"
        className={styles.formattingOptions}
        style={{ marginRight: '15px' }}
      >
        {formattingOptions
          .entrySeq()
          .groupBy(([_, e]) => e.plugin)
          .map(
            (options, { name }) =>
              new Seq([
                <MenuItem
                  primaryText={name}
                  key={name}
                  disabled
                  className={styles.formatPluginName}
                />,
                options.map(([i, option]) => (
                  <MenuItem
                    primaryText={option.name}
                    key={i}
                    value={i}
                    rightIcon={option.default ? <LockedIcon /> : undefined}
                  />
                )),
                <Divider key={'@DIVIDER:' + name} />,
              ])
          )
          .valueSeq()
          .flatten()
          .skipLast(1)}
      </SelectField>
      <TextField
        value={current.name}
        disabled={current.default || !current.plugin.multipleInstances}
        onChange={e => changeCurrentFormattingOptionName(e.target.value)}
        floatingLabelText="Name"
        className={styles.formatName}
        style={{ marginRight: '15px' }}
      />
      <TextField
        value={current.plugin.name}
        disabled
        floatingLabelText="Plugin"
        style={{ width: '150px' }}
      />
      <div className={styles.flexFill} />
      <CreateFormattingOption optionCreated={addFormattingOption} plugins={plugins} />
      <IconButton
        onClick={cloneCurrentFormattingOption}
        disabled={!current.plugin.multipleInstances}
        tooltip="Clone formatting option"
      >
        <CreateIcon />
      </IconButton>
      <IconButton
        onClick={deleteCurrentFormattingOption}
        disabled={current.default || !current.plugin.multipleInstances}
        tooltip="Delete formatting option"
      >
        <DeleteIcon />
      </IconButton>
    </div>
    <current.plugin.FormattingOptions
      updateCurrentFormat={updateCurrentFormattingOption}
      updateFormat={updateFormattingOption}
      format={current.format}
      index={currentIndex}
      isDefault={current.default}
    />
  </Paper>
);

FormattingOptions.propTypes = {
  language: PropTypes.string.isRequired,
  changeFormatLanguage: PropTypes.func.isRequired,
};
export default FormattingOptions;

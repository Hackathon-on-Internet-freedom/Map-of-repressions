import React from 'react';
import pp from 'prop-types';
import styles from './TextHeader.module.css';

const TextHeader = ({ children }) => {
  return <div className={styles.text}>{children}</div>
}

TextHeader.propTypes = {
  children: pp.string
};

export default TextHeader;
import {
  NavbarSecondaryMenuFiller,
  useWindowSize,
} from '@docusaurus/theme-common';
import CopyIcon from '@theme/Icon/Copy';
import IconExternalLink from '@theme/Icon/ExternalLink';
import SuccessIcon from '@theme/Icon/Success';
import React, { useCallback } from 'react';

import { useClipboard } from '../hooks/useClipboard';
import Checkbox from './inputs/Checkbox';
import Dropdown from './inputs/Dropdown';
import Tooltip from './inputs/Tooltip';
import ActionLabel from './layout/ActionLabel';
import Expander from './layout/Expander';
import InputLabel from './layout/InputLabel';
import { createMarkdown, createMarkdownParams } from './lib/markdown';
import { fileTypes, tsVersions } from './options';
import styles from './Playground.module.css';
import type { ConfigModel } from './types';

export interface OptionsSelectorParams {
  readonly state: ConfigModel;
  readonly setState: (cfg: Partial<ConfigModel>) => void;
}

function OptionsSelectorContent({
  state,
  setState,
}: OptionsSelectorParams): React.JSX.Element {
  const [copyLink, copyLinkToClipboard] = useClipboard(() =>
    document.location.toString(),
  );
  const [copyMarkdown, copyMarkdownToClipboard] = useClipboard(() =>
    createMarkdown(state),
  );

  const openIssue = useCallback(() => {
    const params = createMarkdownParams(state);

    window
      .open(
        `https://github.com/typescript-eslint/typescript-eslint/issues/new?${params}`,
        '_blank',
      )
      ?.focus();
  }, [state]);

  return (
    <>
      <Expander label="Info">
        <InputLabel name="TypeScript">
          <Dropdown
            name="ts"
            className="text--right"
            options={tsVersions}
            value={state.ts}
            onChange={(ts): void => setState({ ts })}
          />
        </InputLabel>
        <InputLabel name="Eslint">{process.env.ESLINT_VERSION}</InputLabel>
        <InputLabel name="TSEslint">{process.env.TS_ESLINT_VERSION}</InputLabel>
      </Expander>
      <Expander label="Options">
        <InputLabel name="File type">
          <Dropdown
            name="fileType"
            value={state.fileType}
            onChange={(fileType): void => setState({ fileType })}
            options={fileTypes}
          />
        </InputLabel>
        <InputLabel name="Source type">
          <Dropdown
            name="sourceType"
            value={state.sourceType ?? 'module'}
            onChange={(sourceType): void => setState({ sourceType })}
            options={['script', 'module']}
          />
        </InputLabel>
        <InputLabel name="Auto scroll">
          <Checkbox
            name="enableScrolling"
            checked={state.scroll}
            onChange={(scroll): void => setState({ scroll })}
          />
        </InputLabel>
        <InputLabel name="Show tokens">
          <Checkbox
            name="showTokens"
            checked={state.showTokens}
            onChange={(showTokens): void => setState({ showTokens })}
          />
        </InputLabel>
      </Expander>
      <Expander label="Actions">
        <ActionLabel name="Copy link" onClick={copyLinkToClipboard}>
          <Tooltip open={copyLink} text="Copied">
            {copyLink ? (
              <SuccessIcon width="13.5" height="13.5" />
            ) : (
              <CopyIcon width="13.5" height="13.5" />
            )}
          </Tooltip>
        </ActionLabel>
        <ActionLabel name="Copy Markdown" onClick={copyMarkdownToClipboard}>
          <Tooltip open={copyMarkdown} text="Copied">
            {copyMarkdown ? (
              <SuccessIcon width="13.5" height="13.5" />
            ) : (
              <CopyIcon width="13.5" height="13.5" />
            )}
          </Tooltip>
        </ActionLabel>
        <ActionLabel name="Report as Issue" onClick={openIssue}>
          <IconExternalLink width="13.5" height="13.5" />
        </ActionLabel>
      </Expander>
    </>
  );
}

function OptionsSelector(props: OptionsSelectorParams): React.JSX.Element {
  const windowSize = useWindowSize();
  if (windowSize === 'mobile') {
    return (
      <NavbarSecondaryMenuFiller
        component={OptionsSelectorContent}
        props={props}
      />
    );
  }

  return (
    <div className={styles.playgroundMenu}>
      <OptionsSelectorContent {...props} />
    </div>
  );
}

export default OptionsSelector;

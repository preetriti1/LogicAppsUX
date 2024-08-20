import { Icon, Link } from '@fluentui/react';
import { useIntl } from 'react-intl';

const HybridNotice = () => {
  const intl = useIntl();

  const hybridTitle = intl.formatMessage({
    defaultMessage: 'Hybrid connector',
    id: 'Alq4/3',
    description: 'Resource group title',
  });

  const hybridBodyText = intl.formatMessage({
    defaultMessage:
      'This connector has multiple versions, built-in and Azure-hosted. Use built-in for the best performance, connection-string authentication, and other features. Use Azure-hosted for other authentication options.',
    id: '/VcZ9g',
    description: 'Description about hybrid connectors',
  });

  const learnMoreText = intl.formatMessage({
    defaultMessage: 'Learn more',
    id: 'yzqXMp',
    description: "The text for the 'Learn more' link.",
  });

  return (
    <div className="msla-hybrid-info-container">
      <Icon style={{ fontSize: '20px' }} iconName={'Puzzle'} />
      <div className="msla-hybrid-text-container">
        <span className={'msla-op-group-heading-text'}>{hybridTitle}</span>
        <span className={'msla-op-group-subheading-text'}>
          {hybridBodyText}
          <Link className="msla-hybrid-connectors-link" target="_blank" href="https://aka.ms/built-in-versus-azure-connector" underline>
            {learnMoreText}
            <Icon iconName={'NavigateExternalInline'} style={{ marginLeft: '4px' }} />
          </Link>
        </span>
      </div>
    </div>
  );
};

export default HybridNotice;

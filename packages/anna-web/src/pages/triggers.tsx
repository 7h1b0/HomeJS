import React from 'react';

import Title from 'src/components/title';
import Trigger from 'components/trigger';
import Typographie from 'components/typographie';

import { useDataStoreGetAll } from 'context/db-context';
import { groupBy } from 'modules/array';
import { Trigger as TriggerType } from 'types/trigger';

const Triggers: React.FC<{}> = () => {
  const triggers = useDataStoreGetAll<TriggerType>('triggers');

  if (triggers === null) {
    return <p>Loading</p>;
  }

  const [enabledTriggers, disabledTriggers] = groupBy(
    triggers,
    (triggers) => triggers.enabled,
  );
  return (
    <>
      <Title title="Triggers" />
      <div className="mt-4">
        <Typographie>Enabled</Typographie>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {enabledTriggers.map((triggers) => (
            <Trigger key={triggers.aliasId} trigger={triggers} />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <Typographie>Disabled</Typographie>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {disabledTriggers.map((triggers) => (
            <Trigger key={triggers.aliasId} trigger={triggers} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Triggers;

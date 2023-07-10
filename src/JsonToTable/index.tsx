import clsx from 'clsx';
import React from 'react';
import './index.less';
const typeColorMap = {
  string: 'rgb(58, 181, 74)',
  number: 'rgb(37, 170, 226)',
  boolean: 'rgb(243, 147, 78)',
};

const imageSuffixes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

const isImageUrl = (url) => {
  const path = url.split('/');
  const imageName = path[path.length - 1];
  const imageSuffix = imageName.split('.').pop();
  return (
    imageSuffixes.includes(imageSuffix.toLowerCase()) ||
    url.includes('/img/') ||
    url.includes('hinetmng')
  );
};

const JsonToTable = ({ data, isNested = false, isAbbreviated = false }) => {
  const renderTableContent = (item, index) => {
    if (typeof item === 'object' && item !== null) {
      const keys = Object.keys(item);
      return (
        <React.Fragment key={index}>
          <tr>
            <th>
              <span>#</span>
            </th>
            {keys.map((key) => (
              <th key={key}>
                <span>{key}</span>
              </th>
            ))}
          </tr>
          <tr>
            <td>
              <span style={{ color: 'rgb(37, 170, 226)' }}>{index + 1}</span>
            </td>
            {Object.entries(item).map(([key, value], i) => (
              <td key={i}>
                {typeof value === 'string' && isImageUrl(value) ? (
                  <span
                    className={clsx('tooltip', { abbreviated: isAbbreviated })}
                  >
                    <span style={{ color: typeColorMap[typeof value] }}>
                      {value}
                    </span>
                    <span className="tooltiptext">
                      <img
                        src={value}
                        alt={value}
                        style={{ maxWidth: '200px' }}
                      />
                    </span>
                  </span>
                ) : (
                  <JsonToTable data={value} isAbbreviated={isAbbreviated} />
                )}
              </td>
            ))}
          </tr>
        </React.Fragment>
      );
    } else if (['string', 'number', 'boolean'].includes(typeof item)) {
      return (
        <span
          className={clsx({ abbreviated: isAbbreviated })}
          style={{ color: typeColorMap[typeof item] }}
        >
          {item.toString()}
        </span>
      );
    }
  };

  const renderKeyValue = (key, value) => {
    const valueType = typeof value;
    if (['string', 'number', 'boolean'].includes(valueType)) {
      return (
        <tr key={key}>
          <td>
            <span>{key}</span>
          </td>
          <td>
            <span
              className={clsx({ abbreviated: isAbbreviated })}
              style={{ color: typeColorMap[valueType] }}
            >
              {value.toString()}
            </span>
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={key}>
          <td>
            <span>{key}</span>
          </td>
          <td>
            <JsonToTable data={value} isAbbreviated={isAbbreviated} />
          </td>
        </tr>
      );
    }
  };

  const renderTable = (data) => {
    if (Array.isArray(data)) {
      return <tbody>{data.map(renderTableContent)}</tbody>;
    } else if (typeof data === 'object' && data !== null) {
      return (
        <tbody>
          {Object.entries(data).map(([key, value]) =>
            renderKeyValue(key, value),
          )}
        </tbody>
      );
    } else {
      return (
        <span
          className={clsx({ abbreviated: isAbbreviated })}
          style={{ color: typeColorMap[typeof data] || 'black' }}
        >
          {data}
        </span>
      );
    }
  };

  return (
    <div>
      {typeof data === 'object' ? (
        <table className="table-node" style={{ borderSpacing: '0' }}>
          {renderTable(data)}
        </table>
      ) : (
        renderTable(data)
      )}
    </div>
  );
};

export default JsonToTable;

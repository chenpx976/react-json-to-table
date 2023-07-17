import React from 'react'
import clsx from 'clsx'
import './index.less'
import UrlPreview from '../UrlPreview'

const typeColorMap = {
  string: 'rgb(58, 181, 74)',
  number: 'rgb(37, 170, 226)',
  boolean: 'rgb(243, 147, 78)'
}

// 检查入参是否是 url/image/number/boolean/string
const checkStringType = (data) => {
  const type = typeof data
  if (type !== 'string') {
    return type
  }
  if (data.includes('http')) {
    return 'url'
  }
  return 'string'
}

const BasicType = ({ value, isAbbreviated }) => {
  const stringType = checkStringType(value)
  if (stringType === 'url') {
    return (
      <div className={clsx('tooltip')}>
        <UrlPreview url={value} />
      </div>
    )
  }
  return (
    <div
      className={clsx('basic-type', `${stringType}-type`, { abbreviated: isAbbreviated })}
      style={{ color: typeColorMap[stringType] }}
    >
      {value !== null && value !== undefined ? value.toString() : ''}
    </div>
  )
}

const JsonToTablePro = ({ data, isNested = false, isAbbreviated = false }) => {

  const renderTableContent = (item, index) => {
    if (typeof item === 'object' && item !== null) {
      const keys = Object.keys(item)
      return (
        <React.Fragment key={index}>
          <tr className="object-type">
            <th>
              <div>#</div>
            </th>
            {keys.map((key) => (
              <th key={key}>
                <div>{key}</div>
              </th>
            ))}
          </tr>
          <tr className="object-type">
            <td>
              <BasicType value={index + 1} isAbbreviated={isAbbreviated} />
            </td>
            {Object.entries(item).map(([key, value], i) => (
              <td key={i}>
                {typeof value === 'string' ? (
                  <BasicType value={value} isAbbreviated={isAbbreviated} />
                ) : (
                  <JsonToTablePro data={value} isAbbreviated={isAbbreviated} />
                )}
              </td>
            ))}
          </tr>
        </React.Fragment>
      )
    } else if (['string', 'number', 'boolean'].includes(typeof item)) {
      return <BasicType value={item} isAbbreviated={isAbbreviated} />
    }
  }

  const renderKeyValue = (key, value) => {
    const valueType = typeof value
    if (['string', 'number', 'boolean'].includes(valueType)) {
      return (
        <tr key={key}>
          <td>
            <div>{key}</div>
          </td>
          <td>
            <BasicType value={value} isAbbreviated={isAbbreviated} />
          </td>
        </tr>
      )
    } else {
      return (
        <tr key={key} className={`${Array.isArray(value) ? 'array' : 'object'}-type`}>
          <td>
            <div>{key}</div>
          </td>
          <td>
            <JsonToTablePro data={value} isAbbreviated={isAbbreviated} />
          </td>
        </tr>
      )
    }
  }

  const renderTable = (data) => {
    if (Array.isArray(data)) {
      return <tbody className="array-type">{data.map(renderTableContent)}</tbody>
    } else if (typeof data === 'object' && data !== null) {
      return (
        <tbody className="object-type">
          {Object.entries(data).map(([key, value]) => renderKeyValue(key, value))}
        </tbody>
      )
    } else {
      return <BasicType value={data} isAbbreviated={isAbbreviated} />
    }
  }

  return (
    <>
      {typeof data === 'object' ? (
        <table
          className="table-node"
          style={{ borderSpacing: '0' }}
        >
          {renderTable(data)}
        </table>
      ) : (
        renderTable(data)
      )}
    </>
  )
}

export default JsonToTablePro

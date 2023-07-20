import { filesize } from 'filesize';
import React, { useEffect, useState } from 'react';
// import { Tooltip } from '@chakra-ui/react'

import clsx from 'clsx';
import { checkUrlType } from '../utils';

import './index.less';
const UrlPreview = ({ url }) => {
  const [urlInfo, setUrlInfo] = useState({
    type: 'unknown',
    size: 0,
    mimeType: 'unknown',
    width: 0,
    height: 0,
  });

  useEffect(() => {
    checkUrlType(url).then((result) => {
      setUrlInfo((prevState) => ({
        ...prevState,
        type: result.type,
        size: result.size,
        mimeType: result.mimeType,
      }));
      if (result.type === 'image') {
        const image = new Image();
        image.onload = function () {
          setUrlInfo((prevState) => ({
            ...prevState,
            width: this.width,
            height: this.height,
          }));
        };
        image.onerror = function () {
          console.error(`Failed to load image: ${url}`);
        };
        image.src = url;
      }
    });
  }, [url]);
  const size: any = filesize(urlInfo.size, { base: 2, standard: 'jedec' });
  return (
    <div
      className={clsx('url-preview', {
        'image-preview': urlInfo.type === 'image',
      })}
      style={{
        backgroundImage: urlInfo.type === 'image' ? `url(${url})` : undefined,
      }}
    >
      <span className={clsx('basic-type', `image-type`)}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </span>
      <p>Size: {size} bytes</p>
      {urlInfo.type === 'image' && urlInfo?.width && (
        <p>
          Dimensions: {urlInfo.width}x{urlInfo.height}
        </p>
      )}
    </div>
  );
};

export default UrlPreview;

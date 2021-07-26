import React from 'react';
import clsx from 'clsx';
import { WhiteBlock } from '../../WhiteBlock';
import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';
import { Avatar } from '../../Avatar';
import axios from 'axios';
import Cookie from 'js-cookie';

import styles from './ChooseAvatarStep.module.scss';
import { MainContext } from '../../../pages';

export const ChooseAvatarStep: React.FC = () => {
  const { onNextStep, userData, setFieldValue } = React.useContext(MainContext);
  const [avatarUrl, setAvatarUrl] = React.useState<string>(userData.avatarUrl);
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const handleChangeImage = async (event: Event): Promise<void> => {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      const formData = new FormData();
      formData.append("avatar", file)
      const { data } = await axios.post("http://localhost:3001/upload", formData, {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
          "Content-Type": "multipart/form-data"
        }
      })
      setAvatarUrl(data.url)
      setFieldValue("avatarUrl", data.url)
    }
  };

  React.useEffect(() => {
    if (inputFileRef.current) {
      inputFileRef.current.addEventListener('change', handleChangeImage);
    }
  }, []);

  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/celebration.png"
        title={`Okay, ${userData.fullname || "anonim"}!`}
        description="How’s this photo?"
      />
      <WhiteBlock className={clsx('m-auto mt-40', styles.whiteBlock)}>
        <div className={styles.avatar}>
          <Avatar width="120px" height="120px" src={avatarUrl} letters={userData.fullname.split(' ').map(word => word[0]).join('')} />
        </div>
        <div className="mb-30">
          <label htmlFor="image" className="link cup">
            Choose a different photo
          </label>
        </div>
        <input id="image" ref={inputFileRef} type="file" hidden />
        <Button onClick={onNextStep}>
          Next
          <img className="d-ib ml-10" src="/static/arrow.svg" />
        </Button>
      </WhiteBlock>
    </div>
  );
};

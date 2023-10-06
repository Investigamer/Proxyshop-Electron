/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { increaseCount, setDarkTheme, setPort, setVersion } from '@/renderer/store/slices/appScreenSlice';
import { bodyRoot, jumbo } from '@/renderer/assets/css/global';
import type { RootState } from '@/renderer/store';

const CURRENT_API_PORT = await window.mainApi.invoke('get_api_port')

const Main = () => {

  const darkTheme = useSelector((state: RootState) => state.appScreen.darkTheme)
  const appVersion = useSelector((state: RootState) => state.appScreen.version)
  const counterValue = useSelector((state: RootState) => state.appScreen.counterValue)
  const [t] = useTranslation(['common'])
  const dispatch = useDispatch()
  const [flaskResponse, setFlaskResponse] = useState('Nothing yet')

  const handleGithubLink = async (): Promise<void> => {
    await window.mainApi.send('open_external_url', 'https://github.com/MrTeferi/Proxyshop');
  };

  const handleChangeTheme = (): void => {
    dispatch(setDarkTheme(!darkTheme));
  };

  const handleIncreaseCount = (): void => {
    dispatch(increaseCount());
  };

  const handleCheckFlask = async (): Promise<void> => {
    if (flaskResponse !== '') {
      setFlaskResponse('')
    } else {
      setFlaskResponse(await window.mainApi.invoke('get_flask_response', '/'))
    }
  }

  useEffect(() => {
    // Get application version from package.json version string (Using IPC communication)
    window.mainApi.receive('received_app_version', (event, version: string) => {
      dispatch(setVersion(version));
    });

    window.mainApi.send('request_app_version');
  }, []);

  useEffect(() => {
    // Get application version from package.json version string (Using IPC communication)
    window.mainApi.receive('received_api_port', (event, port: number) => {
      dispatch(setPort(port));
    });

    window.mainApi.send('request_api_port');
  }, []);

  return (
    <div css={bodyRoot}>
      <div css={jumbo}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={5}>
            <img id="main-logo" alt="logo" src="/images/retron-logo.webp" draggable="false" />
          </Grid>
          <Grid item xs={7}>
            <h1>{t('hello-title')}</h1>
            <p>{t('hello-desc')}</p>
            <p>
              {t('using-version')} <strong>{appVersion}</strong>
            </p>
            <p>
              {t('using-port')} <strong>{CURRENT_API_PORT}</strong>
            </p>
            <p>
              {t('count-value')}{' '}
              <span id="counter-value">
                <strong>{counterValue}</strong>
              </span>
            </p>
            <p>
              Flask response: <strong>&quot;{flaskResponse}&quot;</strong>
            </p>
            <ButtonGroup variant="contained">
              <Button onClick={handleGithubLink}>{t('github')}</Button>
              <Button id="btn-change-theme" onClick={handleChangeTheme}>
                {darkTheme ? '🌞' : '🌙'}
              </Button>
              <Button id="btn-counter" color="success" onClick={handleIncreaseCount}>
                +1
              </Button>
              <Button id="btn-counter" color="success" onClick={handleCheckFlask}>
                Check Flask
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Main;

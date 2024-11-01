import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useDebounceFn } from 'ahooks';
import copy from 'copy-to-clipboard';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';
import { useRouter as useNextRouter } from 'next/router';
import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from 'react';
import toast from 'react-hot-toast';
import { AiFillCodepenCircle } from 'react-icons/ai';
import { BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import {
  FaCode,
  FaDesktop,
  FaDownload,
  FaMobile,
  FaUndo,
  FaCopy,
  FaChevronLeft,
  FaLaptopCode,
  FaMobileAlt,
  FaHome,
} from 'react-icons/fa';
import { PiCursorClickFill } from 'react-icons/pi';

import { setUidAnchorPoint } from './compiler';
import UpdateChatInput from './components/chatInput/Update';
import HistoryDisplay from './components/history/HistoryDisplay';
import {
  extractHistoryTree,
  findHistoryById,
} from './components/history/utils';
import NativePreview from './components/NativeMobile';
import Spinner from './components/Spinner';
import { EditorContext, deviceType } from './contexts/EditorContext';
import { HistoryContext } from './contexts/HistoryContext';
import { SettingContext } from './contexts/SettingContext';
import { TemplateContext } from './contexts/TemplateContext';
import { UploadFileContext } from './contexts/UploadFileContext';
import { CodeGenerationParams, generateCode } from './generateCode';

import Preview from '@/components/components/Preview';
import SettingsDialog from '@/components/components/SettingsDialog';
import templates from '@/templates/templates';

const CodeTab = dynamic(() => import('./components/CodeTab'), {
  ssr: false,
});

const PreviewBox = dynamic(() => import('../engine'), {
  ssr: false,
});

function App() {
  const [appState, setAppState] = useState(AppState.INITIAL);
  const [generatedCode, setGeneratedCode] = useState('');

  const [referenceImages, setReferenceImages] = useState([]);
  const [referenceText, setReferenceText] = useState('');
  const [executionConsole, setExecutionConsole] = useState([]);
  const [updateInstruction, setUpdateInstruction] = useState('');
  const [partValue, setPartValue] = useState({ uid: '', message: '' });

  const { dataUrls, setDataUrls } = useContext(UploadFileContext);
  const [isLike, setIsLike] = useState('');

  // Settings
  const {
    settings,
    setSettings,
    initCreate,
    setInitCreate,
    initCreateText,
    setInitCreateText,
  } = useContext(SettingContext);

  const {
    history,
    addHistory,
    currentVersion,
    setCurrentVersion,
    resetHistory,
    updateHistoryCode,
    regain,
  } = useContext(HistoryContext);

  const { enableEdit, setEnableEdit, device, setDevice } =
    useContext(EditorContext);
  const [tabValue, setTabValue] = useState('desktop');
  const [template, setTemplate] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const { debugTemplate, templateList } = useContext(TemplateContext);
  const [currentHistoryId, setCurrentHistoryId] = useState('');
  const [userStory, setUserStory] = useState();

  useEffect(() => {
    let tempUserStory = window.localStorage.getItem('userStory');
    if (tempUserStory) {
      let cookieObject = JSON.parse(tempUserStory);
      setUserStory(cookieObject.userStory);
    } else {
      setUserStory('');
    }
  }, []);

  const [shouldIncludeResultImage, setShouldIncludeResultImage] =
    useState(false);

  const router = useRouter();
  const nextRouter = useNextRouter();

  const wsRef = useRef(null);
  const initFn = useDebounceFn(
    () => {
      if (dataUrls.length) {
        doCreate(dataUrls, '');
        setDataUrls([]);
      }
    },
    {
      wait: 300,
    }
  );
  const initTextFn = useDebounceFn(
    () => {
      if (initCreateText) {
        doCreate([], initCreateText);
        setInitCreateText('');
      }
    },
    {
      wait: 300,
    }
  );

  const historyFn = useDebounceFn(
    () => {
      const slug = nextRouter.query.slug;
      const id = nextRouter.query.id;

      const historyData = findHistoryById(id);
      if (slug?.includes('history') || historyData) {
        setGeneratedCode(historyData[historyData.length - 1].code);
        regain(historyData, id);
        setAppState(AppState.CODE_READY);
        return;
      }
      doCreate([], '', slug);
    },
    {
      wait: 300,
    }
  );

  const templateFn = useDebounceFn(
    () => {
      const slug = nextRouter.query.slug;
      let templateData = templates.list.find(item => item.id === slug);
      let customTemplate = templateList.find(item => item.id === slug);
      if (slug?.includes('debug') || customTemplate) {
        const templateUsed = slug?.includes('debug')
          ? debugTemplate
          : customTemplate;
        setGeneratedCode(templateUsed.code);
        addHistory(
          'create',
          updateInstruction,
          referenceImages,
          referenceText,
          templateUsed.code,
          partValue.message,
          false
        );
        setAppState(AppState.CODE_READY);
        if (templateUsed) {
          setTemplate(templateUsed);
        }
        return;
      }

      if (templateData) {
        setTemplate(templateData);
      }
      doCreate([], '', slug);
    },
    {
      wait: 300,
    }
  );

  useEffect(() => {
    if (!settings.generatedCodeConfig) {
      setSettings({
        ...settings,
        generatedCodeConfig: GeneratedCodeConfig.REACT_ANTD,
      });
    }
  }, [settings.generatedCodeConfig, setSettings]);

  useEffect(() => {
    const slug = nextRouter.query.slug;
    if (slug?.includes('history')) {
      historyFn.run();
      return;
    }
    if (slug === 'create') {
      if (dataUrls.length) {
        initFn.run();
      }
      if (initCreateText) {
        initTextFn.run();
      }
    } else {
      templateFn.run();
    }
  }, [initCreate, dataUrls, initCreateText, template]);

  const takeScreenshot = async () => {
    const iframeElement = document.querySelector('.lc-simulator-content-frame');
    if (!iframeElement?.contentWindow?.document.body) {
      return '';
    }

    const canvas = await html2canvas(iframeElement.contentWindow.document.body);
    const png = canvas.toDataURL('image/png');
    return png;
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download =
      settings.generatedCodeConfig === GeneratedCodeConfig.REACT_SHADCN_UI
        ? 'index.jsx'
        : 'index.html';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setAppState(AppState.INITIAL);
    setGeneratedCode('');
    setReferenceImages([]);
    setExecutionConsole([]);
    resetHistory();
  };

  const stop = () => {
    if (wsRef.current && !wsRef.current.signal.aborted) {
      wsRef.current.abort();
    }
    setAppState(AppState.CODE_READY);
  };

  function doGenerateCode(params, parentVersion) {
    setExecutionConsole([]);
    setAppState(AppState.CODING);

    const updatedParams = {
      ...params,
      ...settings,
      slug: nextRouter.query.slug,
      template,
    };
    generateCode(
      wsRef,
      updatedParams,
      token => setGeneratedCode(prev => prev + token),
      code => {
        setGeneratedCode(code);
        let isAdditive = history.length !== 0;
        addHistory(
          params.generationType,
          updateInstruction,
          referenceImages,
          params.text ? params.text : '',
          code,
          partValue.message,
          isAdditive
        );
      },
      line => setExecutionConsole(prev => [...prev, line]),
      () => {
        setAppState(AppState.CODE_READY);
      },
      error => {
        if (error === 'No openai key, set it') {
          setOpenDialog(true);
        }
      }
    );
  }

  function doCreate(referenceImages, text, slug) {
    reset();

    setReferenceImages(referenceImages);
    setReferenceText(text);

    if (referenceImages.length > 0 || text || slug) {
      doGenerateCode(
        {
          generationType: 'create',
          image: referenceImages[0],
          text,
        },
        currentVersion
      );
    }
  }

  async function doUpdate() {
    if (currentVersion === null) {
      toast.error(
        'No current version set. Contact support or open a Github issue.'
      );
      return;
    }

    const updatedHistory = [
      ...extractHistoryTree(history, currentVersion),
      updateInstruction,
    ];

    if (shouldIncludeResultImage) {
      const resultImage = await takeScreenshot();
      doGenerateCode(
        {
          generationType: 'update',
          image: referenceImages[0],
          text: referenceText,
          resultImage: resultImage,
          history: updatedHistory,
        },
        currentVersion
      );
    } else {
      doGenerateCode(
        {
          generationType: 'update',
          image: referenceImages[0],
          text: referenceText,
          history: updatedHistory,
        },
        currentVersion
      );
    }

    setGeneratedCode('');
    setUpdateInstruction('');
  }

  async function doPartUpdate(partData) {
    const { uid, message } = partData;
    const codeHtml = setUidAnchorPoint(
      uid,
      generatedCode,
      settings.generatedCodeConfig
    );
    updateHistoryCode(codeHtml);

    const updatePrompt = `
      Find the element with attribute data-uid="${uid}" and change it as described below:
      ${message}
      Re-output the code and do not need to output the data-uid attribute.
    `;
    setPartValue(partData);
    setUpdateInstruction(updatePrompt);
  }

  useEffect(() => {
    const errorUpdate = updateInstruction.includes(
      'Fix the code error and re-output the code'
    );
    const partUpdate = updateInstruction.includes('Re-enter the code.');
    if (errorUpdate || partUpdate || updateInstruction) {
      doUpdate();
    }
  }, [updateInstruction]);

  async function fixBug(error) {
    const errorPrompt = `
      Fix the code error and re-output the code.
      error message:
      ${error.message}
      ${error.stack}
    `;
    setUpdateInstruction(errorPrompt);
  }

  const copyCode = useCallback(() => {
    copy(generatedCode);
    toast.success('Copied to clipboard');
  }, [generatedCode]);

  const handleLike = like => {
    setIsLike(like);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        height: '100%',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          insetY: 0,
          zIndex: 40,
          width: 300,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
            borderRight: 1,
            borderColor: 'grey.200',
            bgcolor: 'background.paper',
            px: 4,
            py: 4,
          }}
        >
          {(appState === AppState.CODING ||
            appState === AppState.CODE_READY) && (
            <>
              <Button
                onClick={() => {
                  reset();
                  router.push('/', { scroll: false });
                }}
                startIcon={<FaHome style={{ marginRight: '6px' }} />}
              >
                HOME
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Button
                    onClick={stop}
                    sx={{ width: '100%' }}
                    disabled={appState === AppState.CODE_READY}
                  >
                    Stop
                  </Button>
                </Box>
              </Box>

              {/* Reference image display */}
              <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
                    Original Info
                  </Typography>
                  {referenceText ? (
                    <Box
                      sx={{
                        border: 1,
                        p: 1,
                        borderColor: 'grey.200',
                        width: '100%',
                        borderRadius: 1,
                        bgcolor: '#ebebeb',
                        maxHeight: 320,
                        overflowY: 'scroll',
                      }}
                    >
                      <Typography variant="body2">{referenceText}</Typography>
                    </Box>
                  ) : referenceImages[0] || template.imageUrl ? (
                    <Box
                      component="img"
                      sx={{
                        width: 340,
                        border: 1,
                        borderColor: 'grey.200',
                        borderRadius: 1,
                      }}
                      src={referenceImages[0] || template.imageUrl}
                      alt="Reference"
                    />
                  ) : null}
                </Box>
                {userStory && (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
                      User Story
                    </Typography>
                    <Box
                      sx={{
                        border: 1,
                        p: 1,
                        borderColor: 'grey.200',
                        width: '100%',
                        borderRadius: 1,
                        bgcolor: '#ebebeb',
                        maxHeight: 320,
                        overflowY: 'scroll',
                      }}
                    >
                      <Typography variant="body2">{userStory}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          )}
          <HistoryDisplay
            history={history}
            currentVersion={currentVersion}
            revertToVersion={index => {
              if (index < 0 || index >= history.length || !history[index])
                return;
              setCurrentVersion(index);
              setGeneratedCode(history[index].code);
            }}
            shouldDisableReverts={appState === AppState.CODING}
          />
        </Box>
      </Box>
      <Box
        component="main"
        sx={{
          pl: '300px',
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          pb: 10,
        }}
      >
        <Box sx={{ width: '96%', ml: '2%', flex: 1, mt: 4 }}>
          <Box sx={{ display: 'flex', position: 'absolute', gap: 2 }}>
            <Button
              onClick={copyCode}
              variant="outlined"
              sx={{ minWidth: 36, minHeight: 36 }}
            >
              <FaCopy />
            </Button>
            <Button
              onClick={downloadCode}
              variant="outlined"
              sx={{ minWidth: 36, minHeight: 36 }}
            >
              <FaDownload />
            </Button>
            {typeof isLike === 'boolean' && (
              <Button
                onClick={() => handleLike(!isLike)}
                variant="outlined"
                sx={{ minWidth: 36, minHeight: 36 }}
              >
                {isLike ? <BiSolidLike /> : <BiSolidDislike />}
              </Button>
            )}
            {typeof isLike === 'string' && (
              <>
                <Button
                  onClick={() => handleLike(true)}
                  variant="outlined"
                  sx={{ minWidth: 36, minHeight: 36 }}
                >
                  <BiSolidLike />
                </Button>
                <Button
                  onClick={() => handleLike(false)}
                  variant="outlined"
                  sx={{ minWidth: 36, minHeight: 36 }}
                >
                  <BiSolidDislike />
                </Button>
              </>
            )}
          </Box>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-end', mr: 8, mb: 4 }}
            >
              {settings.generatedCodeConfig ===
              GeneratedCodeConfig.REACT_NATIVE ? (
                <Tab
                  value="native"
                  label={
                    <>
                      <FaDesktop /> Native Mobile
                    </>
                  }
                />
              ) : (
                <Tab
                  value="desktop"
                  label={
                    <>
                      <FaDesktop /> Desktop
                    </>
                  }
                />
              )}
              <Tab
                value="code"
                label={
                  <>
                    <FaCode /> Code
                  </>
                }
              />
            </Box>
            {tabValue === 'native' && (
              <Box sx={{ height: '100%' }}>
                <NativePreview code={generatedCode} appState={appState} />
              </Box>
            )}

            <Box
              sx={{
                height: '100%',
                display: tabValue !== 'desktop' ? 'none' : 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: device === deviceType.PC ? '100%' : 375,
                }}
              >
                <PreviewBox
                  code={generatedCode}
                  appState={appState}
                  sendMessageChange={data => {
                    doPartUpdate(data);
                  }}
                  generatedCodeConfig={settings.generatedCodeConfig}
                  history={history}
                  fixBug={fixBug}
                />
              </Box>

              <Preview
                code={generatedCode}
                device="desktop"
                appState={appState}
                fixBug={fixBug}
              />
            </Box>
            {tabValue === 'code' && (
              <Box sx={{ height: '100%' }}>
                <CodeTab
                  code={generatedCode}
                  setCode={setGeneratedCode}
                  settings={settings}
                />
              </Box>
            )}
          </Tabs>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <Box sx={{ width: 520, borderRadius: 1, boxShadow: 1 }}>
            <UpdateChatInput
              updateSendMessage={message => {
                setUpdateInstruction(message);
                setPartValue({ uid: '', message: '' });
              }}
            />
          </Box>
        </Box>
      </Box>
      <span style={{ display: 'none' }}>
        <SettingsDialog
          settings={settings}
          setSettings={setSettings}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      </span>
    </Box>
  );
}

export default App;

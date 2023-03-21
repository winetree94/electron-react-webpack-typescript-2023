import { Box, Button, CircularProgress, FormLabel, Tab, Tabs, TextField } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
import React, { useState } from 'react';
import './Application.scss';
import ReactCodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import dedent from "dedent";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Application = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState('/Users/parkhansol/workspaces/swit');
  const [ignorePatterns, setIgnorePatterns] = useState([
    'node_modules',
    'build',
    'dist'
  ]);
  const [extensions, setExtensions] = useState(['ts', 'html']);
  const [usageOutput, setUsageOutput] = useState('');
  const [duplicationOutput, setDuplicationOutput] = useState('');

  const [langs, setLangs] = useState<{ json: string; }[]>([{
    json: dedent`{
      "tl.electron.about-swit": "Swit 정보",
      "tl.electron.check-for-updates": "업데이트 확인",
      "tl.electron.account-setting": "사용자 설정",
      "tl.electron.profile-setting": "프로필 설정",
      "tl.electron.notifications": "알림 설정",
      "tl.electron.sign-out": "로그아웃",
      "tl.electron.quit-swit": "Swit 종료",
      "tl.electron.undo": "실행 취소",
      "tl.electron.redo": "다시 실행",
      "tl.electron.cut": "잘라내기",
      "tl.electron.copy": "복사",
      "tl.electron.paste": "붙여넣기",
      "tl.electron.select-all": "모두 선택",
      "tl.electron.downloads": "다운로드",
      "tl.electron.workspaces": "워크스페이스",
      "tl.electron.reload": "새로 고침",
      "tl.electron.zoomin": "확대",
      "tl.electron.zoomout": "축소",
      "tl.electron.actual-size": "실제 크기",
      "tl.electron.toogle-full-screen": "전체화면 시작/종료",
      "tl.electron.minimize": "최소화",
      "tl.electron.close": "닫기",
      "tl.electron.help-center": "도움말 센터",
      "tl.electron.reset-and-quit": "초기화 및 종료",
      "tl.electron.app-will-init-quit": "스윗이 초기화되고 종료됩니다.",
      "tl.electron.about": "정보",
      "tl.electron.edit": "편집",
      "tl.electron.view": "보기",
      "tl.electron.window": "창",
      "tl.electron.help": "도움말",
      "tl.electron.cancel": "취소",
      "tl.electron.keyboard-shortcut": "단축키",
      "tl.electron.launch-startup": "시스템 시작할 때 자동 실행",
      "tl.electron.file-name": "파일 이름 :",
      "tl.electron.save": "저장",
      "tl.electron.preferences": "환경설정",
      "tl.electron.show-download-dialog": "항상 다운로드 위치 선택",
      "tl.electron.default-download-dir": "기본 다운로드 위치 선택"
    }`,
  }, {
    json: dedent`{
      "tl.electron.about-swit": "About Swit",
      "tl.electron.check-for-updates": "Check for Updates...",
      "tl.electron.account-setting": "Account Setting",
      "tl.electron.profile-setting": "Profile Setting",
      "tl.electron.notifications": "Notifications",
      "tl.electron.sign-out": "Sign out",
      "tl.electron.quit-swit": "Quit Swit",
      "tl.electron.undo": "Undo",
      "tl.electron.redo": "Redo",
      "tl.electron.cut": "Cut",
      "tl.electron.copy": "Copy",
      "tl.electron.paste": "Paste",
      "tl.electron.select-all": "Select All",
      "tl.electron.downloads": "Downloads",
      "tl.electron.workspaces": "Workspaces",
      "tl.electron.reload": "Reload",
      "tl.electron.zoomin": "Zoom In",
      "tl.electron.zoomout": "Zoom Out",
      "tl.electron.actual-size": "Actual Size",
      "tl.electron.toogle-full-screen": "Toggle Full Screen",
      "tl.electron.minimize": "Minimize",
      "tl.electron.close": "Close",
      "tl.electron.help-center": "Help center",
      "tl.electron.reset-and-quit": "Reset and Quit",
      "tl.electron.app-will-init-quit": "The app will be initialized and quit.",
      "tl.electron.about": "About",
      "tl.electron.edit": "Edit",
      "tl.electron.view": "View",
      "tl.electron.window": "Window",
      "tl.electron.help": "Help",
      "tl.electron.cancel": "Cancel",
      "tl.electron.keyboard-shortcut": "Keyboard shortcuts",
      "tl.electron.launch-startup": "Auto launch at startup",
      "tl.electron.file-name": "File name :",
      "tl.electron.save": "Save",
      "tl.electron.preferences": "Preferences",
      "tl.electron.show-download-dialog": "Choose location for each download",
      "tl.electron.default-download-dir": "Choose a default download location"
    }`
  }]);
  const [currentJsonTab, setCurrentJsonTab] = useState(0);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const allKeys = Object.keys(langs.reduce((result, lang) => Object.assign(result, JSON.parse(lang.json || '{}')), { ...JSON.parse(langs[0].json) }));

    try {
      const res = await window.electron.invoke('search-keywords', {
        path: path,
        keywords: allKeys,
        extensions: extensions.map((ext) => `.${ext}`),
        ignorePatterns: ignorePatterns,
      });
  
      setUsageOutput(JSON.stringify(
        Object.entries(res).sort((a, b) => {
          return Number(a[1]) - Number(b[1]);
        }).reduce<Record<string, string>>((result, current) => {
          result[current[0]] = current[1];
          return result;
        }, {}),
        null,
        2
      ));

      const langJsons = langs.map((lang) => JSON.parse(lang.json || '{}'));
      const duplicationResult = allKeys.reduce<Record<string, string[]>>((result, key) => {
        const translatedValues = langJsons.map((langJson) => langJson[key].trim()).join(' / ');
        if (!result[translatedValues]) {
          result[translatedValues] = [];
        }
        result[translatedValues].push(key);
        return result;
      }, {});

      setDuplicationOutput(
        JSON.stringify(
          Object.entries(duplicationResult).sort((a, b) => {
            return b[1].length - a[1].length;
          }).reduce<Record<string, string[]>>((result, current) => {
            result[current[0]] = current[1];
            return result;
          }, {}),
          null,
          2
        )
      );
      
    } catch (error) {
      console.error(error);
      console.log('오류 발생!!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} >
          <Tab label="설정" />
          <Tab label="사용율 결과" />
          <Tab label="중복율 결과" />
        </Tabs>
      </Box>
      <TabPanel value={currentTab} index={0}>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <FormLabel>검색 경로</FormLabel>
          <TextField value={path} onChange={e => setPath(e.target.value)} />

          <FormLabel style={{ marginTop: '10px' }}>검색에 포함할 확장자</FormLabel>
          <MuiChipsInput value={extensions} onChange={setExtensions} />

          <FormLabel style={{ marginTop: '10px' }}>검색에 제외할 패턴</FormLabel>
          <MuiChipsInput value={ignorePatterns} onChange={setIgnorePatterns} />
          <Button
            variant="contained"
            type='submit'
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? (
              <><CircularProgress size={30} /> 대충 만들어서 느려요..</>
            ) :
              'GO'
            }
          </Button>

          <FormLabel style={{ marginTop: '10px' }}>검색에 사용할 번역 데이터</FormLabel>
          <Tabs value={currentJsonTab} onChange={(e, v) => setCurrentJsonTab(v)} >
            {langs.map((json, index) => {
              return (
                <Tab key={index} label={`언어 ${index + 1}`} />
              )
            })}
          </Tabs>
          {langs.map((lang, index) => {
            return (
              <TabPanel
                key={index}
                value={currentJsonTab}
                index={index}
                style={{
                  overflow: 'auto',
                  maxHeight: '300px',
                }}>
                <div>
                  <ReactCodeMirror
                    value={lang.json}
                    extensions={[json()]}
                    onChange={(value) => {
                      const newLangs = [...langs];
                      newLangs[index] = { ...newLangs[index], json: value };
                      setLangs(newLangs);
                    }}
                  />
                </div>
              </TabPanel>
            )
          })}
        </form>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        숫자는 얼마나 많이 사용되고 있는지를 의미합니다.
        <br /> 숫자가 0이라면 미사용으로 의심할 수 있습니다.
        <br /> 사용량이 적은 순서대로 정렬됩니다.
        <ReactCodeMirror
          value={usageOutput}
          onChange={setUsageOutput}
          extensions={[json()]}
          style={{ marginTop: '10px' }}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        이곳은 번역 데이터가 모두 일치하는 키의 목록을 출력합니다.
        <br />
        배열에 해당하는 데이터가 많다면 중복으로 의심할 수 있습니다.
        <br />
        중복 결과가 많은 순서대로 정렬됩니다.
        <ReactCodeMirror
          value={duplicationOutput}
          extensions={[json()]}
          style={{ marginTop: '10px' }}
          onChange={setDuplicationOutput}
        />
      </TabPanel>
    </div>
  );
};

export default Application;

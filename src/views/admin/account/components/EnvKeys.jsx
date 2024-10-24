import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Paper,
  Grid,
  Box,
  Card,
} from '@mui/material';
import { useState } from 'react';

import { TextFieldSection } from 'components/index';

export function EnvKeys() {
  // Initial state for AI model keys
  const [keysData, setKeysData] = useState({
    openaiApiKey: 'TEMP_OPENAI_API_KEY',
    openaiOrgId: 'TEMP_OPENAI_ORG_ID',
    anthropicApiKey: 'TEMP_ANTHROPIC_API_KEY',
    googleGeminiApiKey: 'TEMP_GOOGLE_GEMINI_API_KEY',
    mistralApiKey: 'TEMP_MISTRAL_API_KEY',
    groqAPIKey: 'TEMP_GROQ_API_KEY',
    perplexityApiKey: 'TEMP_PERPLEXITY_API_KEY',
  });

  const [tabValue, setTabValue] = useState('EnvKeys');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (key, value) => {
    setKeysData({
      ...keysData,
      [key]: value,
    });
  };

  const handleDownloadKeys = () => {
    const content = Object.entries({
      OPENAI_API_KEY: keysData.openaiApiKey,
      OPENAI_ORG_ID: keysData.openaiOrgId,
      ANTHROPIC_API_KEY: keysData.anthropicApiKey,
      GOOGLE_GEMINI_API_KEY: keysData.googleGeminiApiKey,
      MISTRAL_API_KEY: keysData.mistralApiKey,
      GROQ_API_KEY: keysData.groqAPIKey,
      PERPLEXITY_API_KEY: keysData.perplexityApiKey,
    })
      .filter(([k, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai_model_keys.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card
      //   {...rest}
      sx={{ mb: 2.5, p: 2.5, textAlign: 'center', minHeight: '100%' }}
    >
      <TabContext value={tabValue}>
        <Box>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <TabList>
              <Tab label="EnvKeys" />
            </TabList>
          </Tabs>

          <TabPanel value="EnvKeys">
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      {Object.entries(keysData).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell
                            style={{ fontWeight: 'bold', width: '30%' }}
                          >
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </TableCell>
                          <TableCell style={{ width: '70%' }}>
                            <TextFieldSection
                              fullWidth
                              value={value}
                              label={`Your ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                              onChange={e => handleChange(key, e.target.value)}
                              placeholder={`Your ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                              helperText={`Edit the ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleDownloadKeys}
                >
                  Download Keys
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </TabContext>
    </Card>
  );
}

export default EnvKeys;

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.js";
import { SnackbarProvider } from "notistack";
import {CustomSuccessSnackbar, CustomErrorSnackbar} from "@/components/CustomSnackbar.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
          <SnackbarProvider
              Components={{
                  success: CustomSuccessSnackbar,
                  error: CustomErrorSnackbar,
              }}
          >
            <App />
          </SnackbarProvider>
      </ThemeProvider>
  </StrictMode>,
)

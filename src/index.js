import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import SimpleReactLightbox from 'simple-react-lightbox'
import AuthContextProvider from './contexts/AuthContext'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 1,
			cacheTime: 1000 * 60 * 60 * 2, 
		},
	},
})

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
    <SimpleReactLightbox>
      <App />
      </SimpleReactLightbox>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

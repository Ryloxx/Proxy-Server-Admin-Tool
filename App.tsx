import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import store from './store';
import Root from './views/root';
import ApiProvider from './views/providers/ApiProvider';
import UserProvider from './views/providers/UserProvider';
import { HomeNavigationRef } from './views/root/home';

const def = require('react-native-linear-gradient').default;

const App = () => {
  const theme = extendTheme({
    colors: {
      dark: {
        '100': '#161719',
        '50': '#464a4d',
        '20': '#464a4d',
      },
      light: {
        '100': '#f2f4f5',
        '50': '#e3e5e5',
        '20': '#e3e5e5',
      },
      blue: {
        '100': '#248aff',
        '50': '#57a5ff',
        '20': '#8ac0ff',
      },
      yellow: {
        '100': '#fcbb3c',
        '50': '#fccc6f',
        '20': '#fff6e5',
      },
      green: {
        '100': '#2ab784',
        '50': '#65d1aa',
        '20': '#93eaca',
      },
      red: {
        '200': '#f00',
        '100': '#fd5662',
        '50': '#fd6f7a',
        '20': '#fda2a9',
      },
      primary: {
        '900': '#fd5662',
        '800': '#fd5662',
        '600': '#fd5662',
        '500': '#fd6f7a',
        '400': '#fd6f7a',
        '300': '#fd6f7a',
        '200': '#fda2a9',
        '100': '#fda2a9',
        '50': '#fda2a9',
        '20': '#fda2a9',
      },
      violet: {
        '100': '#8f57ff',
        '50': '#b18aff',
        '20': '#d3bdff',
      },
    },
    fontConfig: {
      Inter: {
        100: {
          normal: 'Inter-Thin',
        },
        200: {
          normal: 'Inter-ExtraLight',
        },
        300: {
          normal: 'Inter-Light',
        },
        400: {
          normal: 'Inter-Regular',
        },
        500: {
          normal: 'Inter-Medium',
        },
        600: {
          normal: 'Inter-SemiBold',
        },
        700: {
          normal: 'Inter-Bold',
        },
        800: {
          normal: 'Inter-ExtraBold',
        },
        900: {
          normal: 'Inter-Black',
        },
      },
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'Inter',
    },
    components: {
      Text: {
        baseStyle: {
          flexShrink: 1,
        },
      },
      Button: {
        baseStyle: {
          rounded: 'xl',
        },
        defaultProps: {
          colorScheme: 'primary',
          m: 4,
          _text: { color: 'light.100' },
        },
      },
    },
    radii: {
      '2xl': 15,
    },
  });
  return (
    <Provider store={store}>
      <NativeBaseProvider
        theme={theme}
        config={{
          dependencies: {
            'linear-gradient': def,
          },
        }}
      >
        <ApiProvider>
          <UserProvider>
            <NavigationContainer ref={HomeNavigationRef}>
              <Root />
            </NavigationContainer>
          </UserProvider>
        </ApiProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;

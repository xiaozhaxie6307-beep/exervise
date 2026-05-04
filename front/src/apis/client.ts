import { ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache } from '@apollo/client';
import { print } from 'graphql';
import jwt_decode from 'jwt-decode';

const httpLink = new HttpLink({ uri: 'http://localhost:7001/graphql' });

interface Decoded {
  exp: number;
}

const refreshTokenMutation = gql`
  mutation RefreshToken($refreshToken: JWT!) {
    refreshToken(token: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

const publicPaths = ['/', '/login', '/register'];

const isPublicPath = () => publicPaths.includes(window.location.pathname);

const clearSession = () => {
  localStorage.setItem('accessToken', '');
  localStorage.setItem('refreshToken', '');
  localStorage.setItem('role', '');
  localStorage.setItem('username', '');
  localStorage.setItem('realname', '');
};

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('accessToken');

  if (token && !isPublicPath()) {
    const decoded: Decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.setItem('accessToken', '');
      return forward(operation);
    }

    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return forward(operation);
});

const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken && refreshToken !== '') {
    const decoded: Decoded = jwt_decode(refreshToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      clearSession();
      return;
    }

    const query = print(refreshTokenMutation);
    const response = await fetch('http://localhost:7001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          refreshToken: `${refreshToken}`,
        },
      }),
    });

    const json = await response.json();
    const { accessToken: access, refreshToken: refresh } = json.data.refreshToken;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }
};

// @ts-ignore
const errorLink = new ApolloLink((operation, forward) => {
  if (isPublicPath()) {
    return forward(operation);
  }

  return forward(operation).map((response) => {
    if (response.errors) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        clearSession();
        return response;
      }

      return refreshAuthToken()
        .then(() => {
          const token = localStorage.getItem('accessToken');
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              Authorization: `Bearer ${token}`,
            },
          }));

          return forward(operation);
        })
        .catch(() => {
          clearSession();
          window.location.href = '/login';
        });
    }

    return response;
  });
});

const refresh = async () => {
  let refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken && refreshToken !== '') {
    const decoded: Decoded = jwt_decode(refreshToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      refreshToken = '';
      clearSession();
      return;
    }

    const query = print(refreshTokenMutation);

    await fetch('http://localhost:7001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          refreshToken: `${refreshToken}`,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { accessToken: access, refreshToken: refresh } = data.data.refreshToken;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
      });
  }
};

const refreshToken = localStorage.getItem('refreshToken');

if (!isPublicPath() && refreshToken && refreshToken !== '') {
  setInterval(refresh, 14 * 60 * 1000);
}

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: {
    watchQuery: {
      notifyOnNetworkStatusChange: true,
    },
    query: {
      notifyOnNetworkStatusChange: true,
    },
  },
});

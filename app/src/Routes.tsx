    import { Route, Switch, HashRouter } from 'react-router-dom';
import { Layout } from './layout';
import HomePage from './pages/home';
import ProposalsPage from './pages/proposals';
import Auctions from './pages/auctions';
import BuyKaoPage from './pages/buy';
import GalleryPage from './pages/gallery';
import StakingPage from './pages/stake';

export const Routes = () => <HashRouter>
  <Layout>
    <Switch>

      <Route exact path="/">
        <HomePage />
      </Route>

      <Route exact path="/stake">
        <StakingPage />
      </Route>

      <Route exact path="/gallery">
        <GalleryPage />
      </Route>

      <Route exact path="/proposals">
        <ProposalsPage />
      </Route>

      <Route exact path="/auctions">
        <Auctions />
      </Route>

      <Route exact path="/buy">
        <BuyKaoPage />
      </Route>

      <Route path="*">
        404 ಥ_ಥ
      </Route>
    </Switch>
  </Layout>
</HashRouter>;

import { Preloader } from '../../components/Preloader';
import { CenteredBox } from '../../components/CenteredBox';

import './InitialLoader.css';

export const InitialLoader = () =>
  <CenteredBox>
    <div className="initial-loader__box">
      <Preloader title="Goals give our lives meaning." />
    </div>
  </CenteredBox>;

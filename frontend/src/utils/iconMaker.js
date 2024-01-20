import { GrActions } from 'react-icons/gr';
import { RxLightningBolt } from 'react-icons/rx';

const createIcon = (iconName) => {
  const iconMap = {
    GrActions,
    RxLightningBolt,
  };
  const Icon = iconMap[iconName];
  return Icon;
};

export default createIcon;

import { connect } from 'react-redux';
import { actions } from 'redux/duck';
import Section from './component';

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (anchor, down) => dispatch(actions.navigateTo(anchor, down)),
});

const SectionContainer = connect(null, mapDispatchToProps)(Section);

export default SectionContainer;

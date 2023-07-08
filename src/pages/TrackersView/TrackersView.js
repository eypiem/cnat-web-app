import './TrackersView.css';
import Trackers from 'components/Trackers/Trackers';




function TrackersView() {

  return (
    <Trackers />
  );
}

function updateTrackers(trackers) {
  this.setState({
    "trackers": trackers
  });
}

export default TrackersView;
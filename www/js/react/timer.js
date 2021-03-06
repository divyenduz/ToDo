var Timer=React.createClass({
  getElapsedTime: function(time){
    return (Date.now()-this.props.createTime) / (1000);    
  },
  getElapsedTimeMessage: function(time){
    try {
      time=parseInt(time);
      if(time<=59){
        return parseInt(time) + " second(s) ago";
      }else if(time<=3599){
        return parseInt(time/60) + " minute(s) ago";
      }else if(time<=86399){
        return parseInt(time/(60*60)) + " hour(s) ago";
      }else if(time<=31557399){
        return parseInt(time/(60*60*24)) + " day(s) ago";
      }else if(time<=315573999){
        return parseInt(time/(60*60*24*365.25)) + " year(s) ago";
      }else{
        return "";
      }
    }
    catch(err) {
      console.log(err);
      return "";
    }
  },
  getInitialState: function(){
    var agoTime = this.getElapsedTime(this.props.createTime);
    var agoTimeMessage = this.getElapsedTimeMessage(agoTime);
    return {
      time: agoTime,
      timeMessage: agoTimeMessage
    };
  },
  tick: function() {
    var agoTime = this.getElapsedTime(this.props.createTime);
    var agoTimeMessage=this.getElapsedTimeMessage(agoTime);
    this.setState({
      time: agoTime,
      timeMessage: agoTimeMessage
    });
  },
  componentDidMount: function(){
    this.interval=setInterval(this.tick, 1000);
  },
  componentWillUnmount: function(){
    clearInterval(this.interval);
  },
  render: function(){
    return (
      <span className={this.props.class}>{this.state.timeMessage}</span>
    );
  }
});

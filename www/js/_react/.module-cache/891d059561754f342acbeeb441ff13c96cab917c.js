var Timer=React.createClass({displayName: "Timer",
  getElapsedTime: function(time){
    try {
      return (Date.now()-this.props.createTime) / (1000);
    }
    catch(err) {
      return (Date.now()-0) / (1000);
    }

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
        return parseInt(time/(60*60*24*365.25)) + " year(s) ago";
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
      React.createElement("span", {className: this.props.class}, this.state.timeMessage)
    );
  }
});

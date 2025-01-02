import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NotFound from "views/NotFound/NotFound";
import routes from "./routes"; // Assuming routes is properly configured
import Dashboard from "views/Dashboard";
// import Activity from 'views/AdminLogs/AdminLogs';
// import Activity from 'views/ContactUsLogs/ContactUsLogs';
// import Activity from 'views/ContactUsQuery/ContactUsQuery';
// import Activity from 'views/ContentManagment/addContentPage';
// import Activity from 'views/EmailTemplates/EmailTemplates';
// import Activity from 'views/Faq/AddFaq';
// import Activity from 'views/Faq/Category/Category';
// import Activity from 'views/Faq/EditFaq';
// import Activity from 'views/ContentManagment/addContentPage';
// import Activity from 'views/ForgotPassword/ForgotPassword';
// import Activity from 'views/Invoice/Invoice';
import Activity from "views/Login/Login";
// import Activity from 'views/Products/AddProduct';
// import Activity from 'views/Profile/profile';
// import Activity from 'views/ResetPassword/ResetPassword';
// import Activity from 'views/Sales/CreateSale';
// import Activity from 'views/SetPassword/SetPassword';
// import Activity from 'views/UserEmailTemplates/AddUserEmailTemplate';
// import Activity from 'views/VerifyEmail/VerifyEmail';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: true, // Set to true to start as logged in
      timeout: 900000, // 15 minutes in milliseconds
    };

    this.idleTimer = null;

    // Bind event listeners
    this.resetTimer = this.resetTimer.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  componentDidMount() {
    this.startIdleTimer();
    window.addEventListener("mousemove", this.resetTimer);
    window.addEventListener("click", this.resetTimer);
    window.addEventListener("keydown", this.resetTimer);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  componentWillUnmount() {
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
    window.removeEventListener("mousemove", this.resetTimer);
    window.removeEventListener("click", this.resetTimer);
    window.removeEventListener("keydown", this.resetTimer);
    this.clearIdleTimer();
  }

  startIdleTimer() {
    this.idleTimer = setTimeout(
      () => this.setState({ loggedIn: false }),
      this.state.timeout
    );
  }

  clearIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
  }

  resetTimer() {
    this.clearIdleTimer();
    this.startIdleTimer();
  }

  handleVisibilityChange() {
    if (document.hidden) {
      const sessionStartTime = parseInt(
        localStorage.getItem("sessionStartTime"),
        10
      );
      const currentTime = Date.now();
      const elapsedTime = currentTime - sessionStartTime;

      if (elapsedTime >= this.state.timeout) {
        this.setState({ loggedIn: false });
      }
    } else {
      localStorage.setItem("sessionStartTime", Date.now());
    }
  }

  render() {
    if (!this.state.loggedIn) {
      return <Redirect to="/login" />; // Redirect to a login page
    }

    return (
      <React.Fragment>
        <Switch>
          {/* <Route exact path="/" component={Home} />  */}
          <Route exact path="/" component={Activity} />{" "}
          {/* Default home route */}
          {/* <Route exact path="/dashboard" component={Dashboard} />{" "} */}
          {/* Default home route */}
          {routes.map((route, index) =>
            route.path ? (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={(props) => (
                  <route.layout {...props}>
                    <route.component {...props} />
                  </route.layout>
                )}
              />
            ) : (
              route.submenus.map((subroute, subkey) => (
                <Route
                  key={index + subkey}
                  path={subroute.path}
                  exact={subroute.exact}
                  component={(props) => (
                    <subroute.layout {...props}>
                      <subroute.component {...props} />
                    </subroute.layout>
                  )}
                />
              ))
            )
          )}
          <Route component={NotFound} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;

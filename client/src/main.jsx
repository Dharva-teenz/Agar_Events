import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
class ErrorBoundary extends React.Component{
 constructor(props){super(props);this.state={error:false};}
 static getDerivedStateFromError(){return {error:true};}
 componentDidCatch(error){console.error('Website rendering error:',error.message);}
 render(){return this.state.error?<div className="connection-state"><h1>Something did not load.</h1><p>Please refresh the page and try again.</p><button className="button" onClick={()=>window.location.reload()}>Refresh Page</button></div>:this.props.children;}
}
createRoot(document.getElementById('root')).render(<React.StrictMode><ErrorBoundary><App/></ErrorBoundary></React.StrictMode>);

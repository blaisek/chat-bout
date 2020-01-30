import React , {Component} from 'react';
import axios from 'axios/index';
import Cookies from 'universal-cookie';
import {v4 as uuid } from 'uuid';

import Message from './Message';
import Card from './Card';

const cookies = new Cookies();



class ChatBot extends Component {

    messagesEnd; 
    talkInput;

    constructor (props) {

        super(props);

        this.state = {
            messages: []
        }
    
        if(cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(),{path: '/'});
        }
       

        // console.log('UserID: ',cookies.get('userID'));
        
    }


    async df_text_query(text) {

        let says = {
            speaks: 'me',
            msg: {
                text: {
                    text: text
                }
            }
        }

        this.setState({messages: [...this.state.messages, says]})
        try {

            const res = await axios.post('/api/df_text_query', {text: text, userID: cookies.get('userID')});

            for ( let msg of res.data.fulfillmentMessages) {            
                says = {
                    speaks: 'bot',
                    msg: msg
                }
    
                this.setState({messages: [...this.state.messages,says]});
            }
    
        } catch(e) {
            says = {
                speaks: 'bot',
                msg: {
                    text: {
                        text: 'il y a un problème de connection, essayons plus tard'
                    }
                }
            }
            this.setState({messages: [...this.state.messages,says]});
        }
        
    }

   async  df_event_query(eventName) {

    let says = {
        speaks: 'me',
        msg: {
            event: {
                event: eventName
            }
        }
    }
try {
    const res = await axios.post('/api/df_event_query', {event: eventName, userID: cookies.get('userID')});

    for ( let msg of res.data.fulfillmentMessages) {


         says = {
            speaks: 'bot',
            msg: msg
        }

        this.setState({messages: [...this.state.messages,says]});
    }


} catch(e){

    says = {
        speaks: 'bot',
        msg: {
            text: {
                text: 'il y a un problème de connection, essayons plus tard'
            }
        }
    }
    this.setState({messages: [...this.state.messages,says]});
}
    
    }

    componentDidMount () {
        this.df_event_query('welcome');    
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({behaviour: "smooth"});
        this.talkInput.focus();
    }

    renderCards(cards) {
           return cards.map((card, i) => <Card key={i} payload={card.structValue}/>)       
    }

    renderOneMessage(message,i) {

        if(message.msg && message.msg.text && message.msg.text.text) {

       return <Message key={i} speaks={message.speaks} text={message.msg.text.text}/>  ;              
       

        } else if (message.msg && message.msg.payload && message.msg.payload.fields && message.msg.payload.fields.cards) {
           
                return    <div key={i}>
                    <div className="card-panel grey lighten-5 z-depth-1" >
                        <div style={{overflow: 'hidden'}}>
                            <div className="col s2">
                                <button href="" className="btn-floating btn-large waves-effect waves-light blue">{message.speaks}</button>
                            </div>
                            <div style={{overflow: 'auto', overflowY: 'scroll'}}>
                                <div style={{height: 300, width: message.msg.payload.fields.cards.listValue.values.length * 270}}>
                                    {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
          
        }

    }

    renderMessages (stateMessages) {
        if(stateMessages) {

           return stateMessages.map((message, i) => {return this.renderOneMessage(message,i)});

        } else {
            return null; 
        }
    }

    _handleInputKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }

    render() {
        return(

            <div style={{height: 400, width: 400, float: 'center', border: '1px solid lightgrey'}}>
                <nav>
                    <div className="nav-wrapper blue darken-3">
                        <a className="brand-logo">Chat'Bout</a>
                    </div>
                </nav>
                <div id="chatbot" syle={{height: 388, width: '100%', overflow: 'auto'}}>
                    {this.renderMessages(this.state.messages)}
                    <div ref={(el) => {this.messagesEnd = el}}
                    syle={{float:'left', clear:"both" }} />
                </div>
                <div className="col s12">
                    <input style={{margin:0,paddingLeft:'1%', paddingRight:'1%', width:'98%'}} placeholder="écris un truc au bot" type="text" ref={(input)=> {this.talkInput = input}} onKeyPress={this._handleInputKeyPress} />
                </div>

            </div>
           
        )
    }

}

export default ChatBot; 
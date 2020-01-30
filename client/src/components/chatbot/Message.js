import React from 'react'; 

const Message = (props) => (

    <div className="col s12 m8 offset-m2 offset-l3">
        <div className="card-pannel grey lighten-5 z-depth-1">
            <div className="row valign-wrapper">
                {props.speaks==='bot' && 
                <div className="col s2">
                    <button href="" className="btn-floating btn-large waves-effect waves-light blue">{props.speaks}</button>
                </div>
                }
                <div className="col s10">
                    <span className="black-text">
                        {props.text}
                    </span>
                </div>
                {props.speaks==='me' && 
                <div className="col s2">
                    <button className="btn-floating btn-large waves-effect waves-light blue">{props.speaks}</button>
                </div>
                }
            </div>
        </div>
    </div>
);


export default Message; 
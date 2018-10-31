import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {render} from 'react-dom'
import {Layout} from "../../controls/layout";


class DescComponent extends Component {
    state =
        {
            data: {}
        };
    arg = this.props.match.params.ticketid;
    //foo = console.log('DescComponent, this.arg: ',this.arg);

    componentDidMount() {

        fetch('/mongoosefind', {
            method: 'post',
            body: JSON.stringify({_id: this.arg}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => this.setState({data: json}))
    };


    render() {
        return (
            <Layout>
                <h5>Title: {this.state.data.ticketNumber}</h5>
                <h5>Desc: {this.state.data.problem}</h5>
                <Link to={'../tickets'}>Обратно к заявкам</Link>
            </Layout>);
    }

} //NewDeafultComponent

export {DescComponent}

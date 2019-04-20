import React,{ Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import './../stylesheets/card.css';
import 'tachyons';

class MenuCard extends Component {

  render() {
    return(
          <div className="card-container">
            <div className='bg-light-orange dib br3 pa3 ma2 grow bw2 shadow-5'>
                <img className="logo" alt = "home" src= {Images.retrievePropertyImages((parseInt(this.props.property.id)%4).toString())} />
              <div>
                <a href="#" id={this.props.property.id} onClick={() => this.handleClick(this.props.property)} ><p className="para-description" >{this.props.property.property_headline} </p> </a>
                <table>
                  <tr>
                    <td> <h3 className="bold-heading-1"> {this.props.property.bedrooms+" BR Condo"}</h3></td>
                    <div className="vl"></div>
                    <td> <h3 className="bold-heading-2"> {this.props.property.bathrooms+" BA"}</h3></td>
                    <div className="vl"></div>
                    <td> <h3 className="bold-heading-3"> {this.props.property.property_area+" sq ft"}</h3></td>
                    <div className="vl"></div>
                    <td> <h3 className="bold-heading-4"> {"Sleeps " +this.props.property.accommodation}</h3></td>
                   </tr>
               </table>
             </div>
        </div>
    </div>

      );
  }
}

export default MenuCard;

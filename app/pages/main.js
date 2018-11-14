import React, {Component} from 'react';
import {Layout} from "../controls/layout";
import {Link} from "react-router-dom";

class Main extends Component{
    render(){
        return (
           <Layout>
               <header><div className="header_title">Welcome ;)</div></header>
               <div className="content">
                   <div className="content_main">
                       <h3>Добро пожаловать!</h3>
                       <span>Данный внутрикорпоративный сервис разработан с целью ведения и контроля заявок на сервисное,
                       гарантийное / постгарантийное обслуживание.</span>
                       <br />
                       <div className="content_main_flex">
                           <div className="content_main_flex_1">
                               <h3>Основные компоненты:</h3>
                               <ul>
                                   <li>
                                       <Link to="/form">Форма создания заявки</Link>
                                       <div className="content_main_desc">Компонент для создания заявки и валидации формы. <br />
                                           После получения запроса backend'ом <br />
                                           <b>1.B БД записываются</b>:
                                           <ul>
                                               <li>данные с формы</li>
                                               <li>время и дата создания заявки</li>
                                               <li>«рандомный» номер заявки</li>
                                           </ul>
                                           --- Объект Date и «рандомный» номер «создаются» на стороне backend'a <br />
                                           <b>2.Модуль express-mailer:</b> отправляет подтверждение на указанный в форме email, в соответствии с шаблоном.
                                           Просьба указывать реальный e-mail ))
                                       </div>
                                   </li>

                                   <li>
                                       <Link to="/tickets">Управление заявками</Link>
                                       <div className="content_main_desc">Компонент для редактирования заявок, назначения сервисного центра, времени необходимого для ремонта и.т.д....</div>
                                   </li>

                                   <li>
                                       <Link to="/servicecenters">Управление сервисными центрами</Link>
                                       <div className="content_main_desc">Компонент для добавления / удаления / редактирования СЦ, <br />
                                           в компоненте реализована функция блокировки удаления СЦ, привязанного к сервисной заявке.</div>
                                   </li>

                                   <li>
                                       <Link to="/search">Поиск</Link>
                                       <div className="content_main_desc">Компонент поиска заявки по ее номеру, принимает аргумент из формы или из адресной строки <br /> (напр. https://api.arroway.cloud/search/12345)
                                       </div>
                                   </li>
                               </ul>
                           </div>

                           <div className="content_main_flex_2">
                               <h3>Стэк технологий</h3>
                               <b>Backend</b>
                               <ul>
                                   <li>IIS</li>
                                   <li>node.js</li>
                                   <li>expressjs</li>
                                   <li>express-mailer</li>
                                   <li>mongoDB</li>
                                   <li>mongoose</li>
                               </ul>

                               <b>Frontend:</b> ReactJS + (react-router)
                               <br />
                               <b>Сборка:</b> webpack
                               <br />
                               <b>Авторизация:</b> изначально планировалось реализовать с пом. Kerberos (на уровне домена Active Directory)
                               <br />
                               <b>Репозиторий:</b> <a href="https://github.com/SkyPeer/WarrantyServiceApp">https://github.com/SkyPeer/WarrantyServiceApp</a>

                           </div>
                       </div>
                   </div>

               </div>

           </Layout>
        )
    }
}
export {Main}

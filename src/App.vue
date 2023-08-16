<script setup></script>
<template>
  <div class="room-container">
    <div class="wrapper">
      <div class="conteiner">
        <header class="header">
          <div class="header__left">
            <button class="tab-button">
              <p class="p__tab-button">Манекен 1</p>
            </button>
            <button class="tab-button">
              <p class="p__tab-button">Манекен 2</p>
              <div class="delete-tab-icon"></div>
            </button>
            <button class="add-tab-button" />
          </div>
          <div class="header__right">
            <button class="tab-button">
              <p class="p__tab-button">Сводная таблица</p>
            </button>
          </div>

        </header>

        <main class="main-wrapper">
          <div class="dummy">
            <div class="dummy__part">

                <div class="parameter__mat__img">
                  <img src="./assets/img/helmet.png" alt="helmet">
                </div>


                <div class="parameter__mat__img">
                  <img src="./assets/img/armor.png" alt="armor">
                </div>


                <div class="parameter__mat__img">
                  <img src="./assets/img/belt.png" alt="belt">
                </div>


                <div class="parameter__mat__img">
                  <img src="./assets/img/boots.png" alt="boots">
                </div>


                <div class="parameter__mat__img">
                  <img src="./assets/img/earring.png" alt="earring">
                </div>


                <div class="parameter__mat__img">
                  <img src="./assets/img/ring.png" alt="ring">
                </div>


                <div class="parameter__mat__img">
                  <img src="./assets/img/ring.png" alt="ring">
                </div>

            </div>
            <div class="dummy__center">
              <div class="dummy__center__top">

                  <div class="parameter__mat__img parameter__mat__small">
                    <img src="./assets/img/relic.png" alt="relic">
                  </div>


                  <div class="parameter__mat__img parameter__mat__small">
                    <img src="./assets/img/relic.png" alt="relic">
                  </div>


                  <div class="parameter__mat__img parameter__mat__small">
                    <img src="./assets/img/relic.png" alt="relic">
                  </div>


                  <div class="parameter__mat__img parameter__mat__small">
                    <img src="./assets/img/relic.png" alt="relic">
                  </div>

              </div>

              <div class="dummy__center__center">
                <div class="options">
                  <div class="options__itemBlock">
                    <table class="table">
                      <thead>
                        <td class="options__table__title" colspan="5"><h3>Манекен 1</h3></td>
                      </thead>
                      <tbody class="options__tbody">
                        <tr>
                          <td>Параметры</td>
                          <td>Сумма</td>
                          <td>Базовые</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                            <img src="./assets/img/icon/svg/strong.svg" alt="strong">
                            Сила</td>
                          <td>3</td>
                          <td><input value="3" placeholder="3" class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src="./assets/img/icon/svg/agility.svg" alt="agility">
                            Ловкость</td>
                          <td>3</td>
                          <td><input value="3" placeholder="3" class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src="./assets/img/icon/svg/intelledgy.svg" alt="intelledgy">
                            Интелект</td>
                          <td>3</td>
                          <td><input value="3" placeholder="3" class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src="./assets/img/icon/svg/luck.svg" alt="luck">
                            Удача</td>
                          <td>3</td>
                          <td><input value="3" placeholder="3" class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src="./assets/img/icon/svg/reaction.svg" alt="reaction">
                            Реакция</td>
                          <td>3</td>
                          <td><input value="3" placeholder="3" class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src="./assets/img/icon/svg/wisdom.svg" alt="wisdom">
                            Мудрость</td>
                          <td>3</td>
                          <td><input value="3" placeholder="3" class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src="./assets/img/icon/svg/constitution.svg" alt="constitution">
                            Сложение</td>
                          <td>3</td>
                          <td><input value="3" placeholder="3" class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="options__itemBlock">
                    <div class="form">
                      <form action="">
                        <div class="form__items">
                          <select class="form__input_rase select-css">
                            <option disabled selected>Выбери расу</option>
                            <option class="option">Человек</option>
                            <option>Гном</option>
                            <option>Эльф</option>
                            <option>Вампир</option>
                            <option>Орк</option>
                            <option>Троль</option>
                          </select>

                          <select class="form__input_lvl select-css">
                            <option disabled selected>Выбери уровень</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                            <option>13</option>
                            <option>14</option>
                            <option>15</option>
                            <option>16</option>
                            <option>17</option>
                            <option>18</option>
                            <option>19</option>
                            <option>20</option>
                            <option>21</option>
                            <option>22</option>
                            <option>23</option>
                            <option>24</option>
                            <option>25</option>
                            <option>26</option>
                            <option>27</option>
                            <option>28</option>
                            <option>29</option>
                            <option>30</option>
                          </select>
                        </div>

                        <div class="form__items">
                          <select class="form__input_rase select-css">
                            <option disabled selected>Крепость</option>
                            <option>Нет</option>
                            <option>Новичок</option>
                            <option>Продвинутый</option>
                            <option>Эксперт</option>
                            <option>Мастер</option>
                            <option>Грандмастер</option>
                          </select>
                        </div>
                        <div class="form__items">
                          <a href="#" class="form__link">Выпить эликсир</a>
                          <p>Выпито: 0</p>
                        </div>
                      </form>

                      <div class="form__items">
                        <input id="html" type="checkbox" />
                        <label for="html">То что можно одеть</label>
                        <a href="#" class="form__link">Сбросить все</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="dummy__center__buttom">

                  <div class="parameter__mat__img parameter__mat__Armor__img">
                    <img src="./assets/img/weapons.png" alt="weapons">
                  </div>


                  <div class="parameter__mat__img parameter__mat__Armor__img">
                    <img src="./assets/img/weapons.png" alt="weapons">
                  </div>

              </div>
            </div>
            <div class="dummy__part">

                <div class="parameter__mat__img">
                  <img src="./assets/img/necklace.png" alt="">
                </div>

                <div class="parameter__mat__img">
                  <img src="./assets/img/bracers.png" alt="">
                </div>

                <div class="parameter__mat__img">
                  <img src="./assets/img/gloves.png" alt="">
                </div>

                <div class="parameter__mat__img">
                  <img src="./assets/img/leggings.png" alt="">
                </div>

                <div class="parameter__mat__img">
                  <img src="./assets/img/earring.png" alt="earring">
                </div>

                <div class="parameter__mat__img">
                  <img src="./assets/img/ring.png" alt="ring">
                </div>

                <div class="parameter__mat__img">
                  <img src="./assets/img/ring.png" alt="ring">
                </div>

            </div>
          </div>
          <div class="dummy__buttom">
            <div class="options__itemBlock options__itemBlock_button">
              <table class="table">
                <thead>
                  <td class="options__table__title" colspan="5"><h3>Манекен 1</h3></td>
                </thead>
                <tbody class="options__tbody">
                  <tr>
                    <td>Параметры</td>
                    <td>Сумма</td>
                    <td>Базовые</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/strong.svg" alt="strong">
                      Сила</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/agility.svg" alt="agility">
                      Ловкость</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/intelledgy.svg" alt="intelledgy">
                      Интелект</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/luck.svg" alt="luck">
                      Удача</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/reaction.svg" alt="reaction">
                      Реакция</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/wisdom.svg" alt="wisdom">
                      Мудрость</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/constitution.svg" alt="constitution">
                      Сложение</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="options__itemBlock options__itemBlock_button">
              <table class="table">
                <thead>
                  <td class="options__table__title" colspan="4"><h3>Броня</h3></td>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/armor_head.svg" alt="armor_head">
                      Голова</td>
                    <td>0</td>
                    <td>
                      <img src="./assets/img/icon/svg/armor.svg" alt="armor">
                      Туловище</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/leftHend.svg" alt="leftHend">
                      Левая рука</td>
                    <td>0</td>

                    <td>
                      <img src="./assets/img/icon/svg/rightHend.svg" alt="rightHend">
                      Правая рука</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/leg-armor.svg" alt="leg-armor">
                      Ноги</td>
                    <td>0</td>
                    <td></td>
                    <td></td>
                  </tr>
                  
                </tbody>
              </table>

              <table class="table">
                <thead>
                  <td class="options__table__title" colspan="2"><h3>Защита от магии</h3></td>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/dawn.svg" alt="dawn">
                      Рассвет</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/full-moon.svg" alt="full-moon">
                      Полнолуние</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/astral.svg" alt="astral">
                      Астрал</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="options__itemBlock options__itemBlock_button">
              <table class="table">
                <tbody>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/health.svg" alt="health">
                      Жизнь</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/mana.svg" alt="mana">
                      Мана</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/power.svg" alt="power">
                      Энергия</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="./assets/img/icon/svg/rating.svg" alt="rating">
                      Рейтинг</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="options__itemBlock options__itemBlock_button">
                
                <table class="table">
                  <thead>
                      <td class="options__table__title" colspan="5"><h3>Стоимость</h3></td>
                    </thead>
                <tbody>
                  <tr>
                        <td>Талы</td>
                        <td>Золотые талы</td>
                        <td>Ратник</td>
                        <td>Обмены</td>
                        <td>Реликты</td>
                      </tr>
                      <tr>
                        <td>1000000</td>
                        <td>1000</td>
                        <td>300</td>
                        <td>5</td>
                        <td>500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

          </div>
        </main>
      </div>
    </div>
  </div>
</template>

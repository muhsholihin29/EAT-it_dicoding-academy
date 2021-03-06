import '../../../styles/detail.css';
import UrlParser from '../../routes/url-parser';
import restaurantSource from '../../data/restaurant-source';
import { createRestaurantDetailTemplate } from '../templates/template-creator';
import LikeButtonPresenter from '../../utils/like-button-presenter';
import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';

const Detail = {
    async render() {
        return /* html */ `        
        <div class="main-header">
          <content-restaurant></content-restaurant>
      </div>
      <div class="container">
          <div class="form-review" style="margin-top: 40px;">              
              <form class="main-form">
                  <div class="col-form">
                      <label for="name">Name</label>
                      <input type="text" id="name" name="name" placeholder="Enter your name" value="">
                  </div>
                  <div class="col-form">
                      <label for="review">Review</label>
                      <textarea id="review" name="review" placeholder="Your review here..." rows="5"></textarea>
                  </div>
                  <button id="submitReview" aria-label="submit review" class="btn btn-warning">Submit</button>
              </form>
              <div class="main-review"></div>
          </div>        
      </div>
      <div id="likeButtonContainer"></div>
      `;
    },

    async afterRender() {
        window.scrollTo(0, 0);
        const url = UrlParser.parseActiveUrlWithoutCombiner();
        const restaurant = await restaurantSource.detailRestaurant(url.id);
        console.log(restaurant);
        const restaurantContainer =
            document.querySelector('content-restaurant');
        // const restaurantMenu = document.querySelector('#restaurant-menu');
        restaurantContainer.innerHTML =
            createRestaurantDetailTemplate(restaurant);
        await this.addCustomerReviews(url.id);

        LikeButtonPresenter.init({
            likeButtonContainer: document.querySelector('#likeButtonContainer'),
            favoriteRestaurants: FavoriteRestaurantIdb,
            restaurant: {
                id: restaurant.id,
                name: restaurant.name,
                pictureId: restaurant.pictureId,
                rating: restaurant.rating,
                city: restaurant.city,
                description: restaurant.description,
            },
        });
    },

    async addCustomerReviews(id) {
        $('#submitReview').click(() => {
            const name = document.getElementById('name').value;
            const review = document.getElementById('review').value;

            if (name !== '' || review !== '') {
                const reviewData = {
                    id,
                    name,
                    review,
                };

                restaurantSource.reviewRestaurant(reviewData);
            }
        });
    },
};

export default Detail;

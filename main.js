var eventBus = new Vue();

Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: ` 
	<div class="product">
	<div class="product-image">
		<img v-bind:src="image">
	</div>
	<div class="product-info">
		<h1>{{ title }}</h1>
		<p v-if="inStock > 10">In stock</p>
		<p v-else-if="inStock <=10 && inStock > 0">Almost out of stock</p>
		<p v-else :class="{ outSclass: 'inStock = 0'}">Out of Stock</p>
		<p>Shipping: {{ shipping }}</p>

		<p v-show="onSale">ON SALE!!!</p>
		<p>{{printOnSale}}</p>


		<ul>
			<li v-for="detail in details">{{detail}}</li>
		</ul>
		<div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
			:style="{backgroundColor: variant.variantColor}" @mouseover="updateProduct(index)">
		</div>
		<div v-for="size in sizes">
			<ul>
				<li>{{size}}</li>
			</ul>
		</div>
		<button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock}">Add to
			Cart</button>
		<button v-on:click="remFromCart"> - </button>
		</div>
		
		<div class="bottom">
		<product-tabs :reviews="reviews"></product-tabs>

		</div>
	</div>

	`,
	data() {
		return{
			brand: 'Gucci',
			product: 'Socks',
			description: 'Esqueta os pes',
			selectedVariant: 0,
			//		image: './assets/vmSocks-green.jpg',
			onSale: true,
			details: ["80% cotton", "20% plyester", "Gender-neutral"],
			variants: [{
					variantId: 2234,
					variantColor: "green",
					variantImage: 'assets/vmSocks-green.jpg',
					variantQuantity: 11
				},
				{
					variantId: 2235,
					variantColor: "blue",
					variantImage: "assets/vmSocks-blue.jpg",
					variantQuantity: 05
				},
				{
					variantId: 2236,
					variantColor: "red",
					variantImage: "assets/vmSocks-red.jpg",
					variantQuantity: 00
				}
			],
			reviews: [],
			sizes: ["Extra small", "Small", "Medium", "Large", "Extra large"],
			linkBuscador: 'http://www.google.com'
	
		}
	},
	methods: {
		addToCart: function () {
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
			this.variants[this.selectedVariant].variantQuantity -= 1;
		},
		remFromCart: function () {
			console.log("teste");
			if (app.cart.includes(this.variants[this.selectedVariant].variantId) > 0) {
				this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
				this.variants[this.selectedVariant].variantQuantity += 1;
			}
		},
		updateProduct: function (index) {
			this.selectedVariant = index;
			console.log(index);
		},

		disabledButton: function () {}
	},
	computed: {
		title() {
			return (this.brand + ' ' + this.product);
		},
		image() {
			return this.variants[this.selectedVariant].variantImage;
		},
		inStock() {
			return this.variants[this.selectedVariant].variantQuantity;
		},
		printOnSale() {
			if (this.onSale) {
				return ("Hurry!! " + this.brand + ' ' + this.product + " is ON SALE!!!");
			}
		},
		shipping() {
			if (this.premium) {
				return "Free"
			}
			return 5.99 
		}
	},
	mounted() {
		eventBus.$on('review-submitted', productReview => {
			this.reviews.push(productReview);
		})
	}
})

Vue.component('product-details', {
	props: {
		details: {
			type: String,
			required: true
		}
	},
	template: `
		<p> Aqui: {{ details }} </p>
	`
})

Vue.component('product-review', {
	template: `
		<form class="review-form" @submit.prevent="onSubmit">

			<p v-if="errors.length">
				<b>Please correct the following error(s)</b>
				<ul>
					<li v-for="error in errors">{{ error }}</li>
				</ul>
			<p>
				<label for="name">Name:</label>
				<input id="name" v-model="name" placeholder="name">
			</p>
			<p>
				<label for="review">Review:</label>
				<textarea id="review" v-model="review"></textarea>
			</p>
			<p>
				<label for="rating">Rating:</label>
				<select if="rating" v-model.number="rating">
					<option>5</option>
					<option>4</option>
					<option>3</option>
					<option>2</option>
					<option>1</option>
				</select>
			</p>
			<section>
				<p> Would you recommend this product?</p>
				<input type="radio" v-model="radioForm" value="2">2 Yes, of course!<br>
				<input type="radio" v-model="radioForm" value="1">1 Maybe I would<br>
				<input type="radio" v-model="radioForm" value="0">0 No, I hate it<br>
			</section>
			<p>
				<input type="submit" value="Submit">
			</p>

		</form>
	`,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			radioForm: null,
			errors: []
		}
	},
	methods: {
		onSubmit() {
			if (this.name && this.review && this.rating && this.radioForm) {
				let productReview = {
					name: this.name,
					review: this.review,
					rating: this.rating,
					recommend: this.radioForm
				}
				eventBus.$emit('review-submitted', productReview);
				this.name = null;
				this.rating = null,
				this.review = null;
				this.radioForm = null;
			}
			else {
				if (!this.name) this.errors.push("Name required");
				if (!this.review) this.errors.push("Review required");
				if (!this.rating) this.errors.push("Rating required");
				if (!this.radioForm) this.errors.push("Recommend required");
			}
		}
	}
})

Vue.component('product-tabs', {
	props: {
		reviews: {
			type: Array,
			required: true
		}
	},
	template: `
		<div>
			<div>
			<span class="tabs" 
					:class="{ activeTab: selectedTab === tab }"
					v-for="(tab, index) in tabs"
					:key="index"
					@click="selectedTab = tab"
			> {{ tab }} </span>
			</div>

				
			<div v-show="selectedTab === 'Reviews'">
				<p v-if="!reviews.length">There are no reviews yet.</p>
				<ul v-else>
					<li v-for="review in reviews">
					<p>{{ review.name }}</p>
					<p>Rating:{{ review.rating }}</p>
					<p>{{ review.review }}</p>
					</li>
				</ul>
			</div>
			
			<div v-show="selectedTab === 'Make a Review'">
				<product-review></product-review>
			</div>
			<div v-show="selectedTab === 'Shipping'">
				<p> Infos sobre shipping aqui. </p>
			</div>
			<div v-show="selectedTab === 'Details'">
				<p> Muitos details aqui. </p>
			</div>
			
		</div>


	`,
	data() {
		return {
			tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
			selectedTab: 'Reviews'
		}
	}
})
var app = new Vue({
	el: '#app',
	data: {
		premium: true,
		details: 'Ola mundo',
		cart: []
	},
	methods: {
		updateCart(id) {
			this.cart.push(id);
		},
		remID(id) {
			array = this.cart;
			console.log("LOG: remID");
			i = 0;
			while(i<array.length){
			  if(array[i] == id){
				array = array.splice(i,1);
				i = array.length + 1;
			  }
			  i++;
			}
		  }
	}
});


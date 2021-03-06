import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import io from 'steal-socket.io';
import baseUrl from '../service-base-url';

const ItemsList = DefineList.extend({}, {
  has: function(item) {
    return this.indexOf(item) !== -1;
  },

  toggle: function(item) {
    var index = this.indexOf(item);

    if (index !== -1) {
      this.splice(index, 1);
    } else {
      this.push(item);
    }
  }
});

let Order = DefineMap.extend({
  seal: false
}, {
  name: "string",
  address: "string",
  phone: "string",
  restaurant: "string",

  status: {
    value: 'new'
  },
  items: {
    Value: ItemsList
  },
  total: {
    get() {
      let total = 0.0;
      this.items.forEach(item =>
          total += parseFloat(item.price));
      return total.toFixed(2);
    }
  },

  markAs(status) {
    this.status = status;
    this.save();
  }
});

Order.List = DefineList.extend({
  '*': Order
});

export const connection = superMap({
  url: baseUrl + '/api/orders',
  idProp: '_id',
  Map: Order,
  List: Order.List,
  name: 'orders'
});

const socket = io(baseUrl);

socket.on('orders created', order => connection.createInstance(order));
socket.on('orders updated', order => connection.updateInstance(order));
socket.on('orders removed', order => connection.destroyInstance(order));

tag('order-model', connection);

export default Order;

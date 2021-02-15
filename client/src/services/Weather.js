import API from '@/services/API';

const key = 'e5dc718f63729035bc4d1d3bfce513e1';
const units = 'metric';

export default {
    weatherByCity(city) {
        return API().get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=${units}`
        );
    },

    addDynamicWeatherWidget(widgetName) {
        return API().post('/services/weather/add/dynamicWeather', {
            name: widgetName
        });
    },

    addStaticWeatherWidget(name, place, timer) {
        return API().post('/services/weather/add/staticWeather', {
            name: name,
            place: place,
            timer: timer
        });
    },

    getWeatherWidget() {
        return API().get('/services/weather/get');
    },

    deleteWeatherWidget(widgetId) {
        return API().post('/services/weather/delete', { id: widgetId });
    },

    modifyWeatherWidget(widgetParams) {
        return API().post('/services/weather/modify', {
            newParams: widgetParams
        });
    }
};

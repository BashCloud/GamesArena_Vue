new Vue({
    el: '#app',
    data: function data() {
        return {
            search: '',
            sort: '',
            urlPrefix: 'http://www.ign.com', //asumed for working links
            games: [],
            pageNumber: 0,
            pageSize: 6,
            pageCount: 10,
        };
    },
    mounted() {
        var localGames = localStorage.getItem('games');
        if (localGames) {
            this.games = JSON.parse(localGames);
            console.log("Fetching data from local storage...");
        } else {
            axios.get("http://starlord.hackerearth.com/gamesext")
                .then(response => {
                    this.games = response.data;
                    localStorage.setItem('games', JSON.stringify(this.games));
                })
        }
    },
    methods: {
        nextPage() {
            if (this.pageNumber < this.pageCount)
                this.pageNumber++;
        },
        prevPage() {
            if (this.pageNumber > 1)
                this.pageNumber--;
        }
    },
    computed: {
        getGames() {
            var _this = this;
            var games = this.games.filter(function(game) {
                if (typeof(game.title) == 'number') { //Special case for 1000000 at index 160
                    game.title = game.title.toString();
                }
                return game.title.toLowerCase().includes(_this.search.toLowerCase());
            });
            if (this.sort == 'score') {
                games = games.sort(function(a, b) {
                    return b.score - a.score;
                });
            }
            this.pageCount = Math.floor(games.length / this.pageSize);
            if (this.pageNumber > this.pageCount)
                this.pageNumber = this.pageCount;
            var startIndex = this.pageNumber * this.pageSize;
            var endIndex = startIndex + this.pageSize;
            return games.slice(startIndex, endIndex);
        }
    },
    filters: { //To generate Icon
        firstChar: function(str) {
            var strs = str.split(" ");
            var msg2 = (strs.length > 1) ? strs[1].charAt(0) : '';
            return strs[0].charAt(0) + msg2;
        }
    }
});
import React, { Component } from "react";
import Loading from "./Loading";
import NewsItem from "./NewsItem";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      article: [],
      loading: false,
      page: 1,
      totalResults : 0
    };
    document.title = `${this.props.category} News`;
  }

  async componentDidMount() {
    this.props.setProgress(10)
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=1&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30)
    let parsedDate = await data.json();
    this.props.setProgress(70)
    this.setState({
      article: parsedDate.articles,
      totalResults: parsedDate.totalResults,
      loading: false,
    });
    this.props.setProgress(100)
  }

  // handlePreviousClick = async () => {
  //   let url = `https://newsapi.org/v2/top-headlines?country=${
  //     this.props.country
  //   }&category=${
  //     this.props.category
  //   }&apiKey=6686e8896a1d43a3b1df79dfda3b38a7&page=${
  //     this.state.page - 1
  //   }&pageSize=${this.props.pageSize}`;
  //   this.setState({ loading: true });
  //   let data = await fetch(url);
  //   let parsedDate = await data.json();
  //   this.setState({
  //     article: parsedDate.articles,
  //     page: this.state.page - 1,
  //     loading: false,
  //   });
  // };

  // handleNextClick = async () => {
  //   if (
  //     this.state.page + 1 >
  //     Math.ceil(this.state.totalResults / this.props.pageSize)
  //   ) {
  //   } else {
  //     let url = `https://newsapi.org/v2/top-headlines?country=${
  //       this.props.country
  //     }&category=${
  //       this.props.category
  //     }&apiKey=6686e8896a1d43a3b1df79dfda3b38a7&page=${
  //       this.state.page + 1
  //     }&pageSize=${this.props.pageSize}`;
  //     this.setState({ loading: true });
  //     let data = await fetch(url);
  //     let parsedDate = await data.json();
  //     this.setState({
  //       article: parsedDate.articles,
  //       page: this.state.page + 1,
  //       loading: false,
  //     });
  //   }
  // };

  fetchMoreData = async () => {
    this.setState({
      page :this.state.page + 1
    })

    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedDate = await data.json();
    this.setState({
      article: this.state.article.concat(parsedDate.articles),
      totalResults: parsedDate.totalResults
    
    });

    
  };

  render() {
    return (
      <>
          <h1 className="text-center" style={{ margin: "35px 0px" }}>
            Top Headlines on {this.props.category}{" "}
          </h1>
          {this.state.loading && <Loading />}
          <InfiniteScroll
            dataLength={this.state.article.length}
            next={this.fetchMoreData}
            hasMore={this.state.article.length !== this.state.totalResults}
            loader={<Loading/>}
          >
            <div className="container">
              <div className="row">
                {this.state.article.map((element) => {
                  return (
                    <div className="col-md-4" key={element.url}>
                      <NewsItem
                        title={element.title ? element.title : ""}
                        desc={element.description ? element.description : ""}
                        newsUrl={element.url}
                        imageUrl={element.urlToImage}
                        author={element.author}
                        date={element.publishedAt}
                        />
                    </div>
                  );
                })}
              </div>
            </div>
          </InfiniteScroll>
          {/* <div className="container d-flex justify-content-between">
            <button
              type="button"
              disabled={this.state.page <= 1}
              className="btn btn-dark"
              onClick={this.handlePreviousClick}
            >
              &larr; Previous
            </button>
            <button
              disabled={
                this.state.page + 1 >
                Math.ceil(this.state.totalResults / this.props.pageSize)
              }
              type="button"
              className="btn btn-dark"
              onClick={this.handleNextClick}
            >
              Next &rarr;
            </button>
          </div> */}
      </>
    );
  }
}

export default News;

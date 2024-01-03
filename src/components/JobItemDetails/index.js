import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsStarFill, BsBoxArrowUpRight} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const jobItemDetailsConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobItemDetails extends Component {
  state = {jobItemStatus: jobItemDetailsConstant.initial, jobItemDetails: {}}

  componentDidMount() {
    this.getItemDetailsApi()
  }

  getItemDetailsApi = async () => {
    this.setState({jobItemStatus: jobItemDetailsConstant.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          jobDescription: data.job_details.job_description,
          id: data.job_details.id,
          skills: data.job_details.skills.map(eachSkill => ({
            imageUrl: eachSkill.image_url,
            name: eachSkill.name,
          })),
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          title: data.job_details.title,
        },
        similarJobs: data.similar_jobs.map(eachSimilarJob => ({
          location: eachSimilarJob.location,
          rating: eachSimilarJob.rating,
          title: eachSimilarJob.title,
          companyLogoUrl: eachSimilarJob.company_logo_url,
          employmentType: eachSimilarJob.employment_type,
          jobDescription: eachSimilarJob.job_description,
          id: eachSimilarJob.id,
        })),
      }
      this.setState({
        jobItemStatus: jobItemDetailsConstant.success,
        jobItemDetails: updatedData,
      })
    } else {
      this.setState({jobItemStatus: jobItemDetailsConstant.failure})
    }
  }

  renderDetails = jobDetails => {
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      title,
      location,
      rating,
      lifeAtCompany,
      packagePerAnnum,
      skills,
    } = jobDetails

    return (
      <div className="job-details-container">
        <div className="img-title-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="icon-star" />
              <p className="icon-para">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-employment-type-salary-container">
          <div className="location-employment-type-container">
            <div className="icon-container">
              <MdLocationOn className="icon" />
              <p className="icon-para">{location}</p>
            </div>
            <div className="icon-container">
              <BsBriefcaseFill className="icon" />
              <p className="icon-para">{employmentType}</p>
            </div>
          </div>
          <p className="salary-para">{packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <div className="description-visit-container">
          <h1 className="description">Description</h1>
          <a href={companyWebsiteUrl} className="visit">
            <p className="visit-para">Visit</p>
            <BsBoxArrowUpRight className="visit-icon" />
          </a>
        </div>
        <p className="description-para">{jobDescription}</p>
        <h3 className="skill-heading">Skills</h3>
        <ul className="skills-list">
          {skills.map(eachSkill => (
            <li className="skill-item" key={eachSkill.name}>
              <img
                src={eachSkill.imageUrl}
                alt={eachSkill.name}
                className="skill-img"
              />
              <p className="skill-name">{eachSkill.name}</p>
            </li>
          ))}
        </ul>
        <h3 className="skill-heading">Life at Company</h3>
        <div className="life-at-company-container">
          <p className="life-at-para">{lifeAtCompany.description}</p>
          <img
            src={lifeAtCompany.imageUrl}
            alt="life at company"
            className="life-img"
          />
        </div>
      </div>
    )
  }

  renderJobItemSuccess = () => {
    const {jobItemDetails} = this.state
    const {jobDetails, similarJobs} = jobItemDetails

    return (
      <div className="job-item-details-container">
        {this.renderDetails(jobDetails)}
        <h1 className="description">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(eachSimilar => {
            const {
              location,
              rating,
              title,
              companyLogoUrl,
              jobDescription,
              employmentType,
              id,
            } = eachSimilar
            return (
              <li className="similar-job-item" key={id}>
                <div className="img-title-container">
                  <img
                    src={companyLogoUrl}
                    alt="similar job company logo"
                    className="similar-logo"
                  />
                  <div className="title-rating-container">
                    <h1 className="skill-heading">{title}</h1>
                    <div className="rating-container">
                      <BsStarFill className="icon-star" />
                      <p className="icon-para">{rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="skill-heading">Description</h1>
                <p className="similar-job-para">{jobDescription}</p>
                <div className="img-title-container">
                  <div className="icon-container">
                    <MdLocationOn className="icon" />
                    <p className="icon-para">{location}</p>
                  </div>
                  <div className="icon-container">
                    <BsBriefcaseFill className="icon" />
                    <p className="icon-para">{employmentType}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderJobItemFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.getItemDetailsApi}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemLoading = () => (
    <div className="failure-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderPage = () => {
    const {jobItemStatus} = this.state

    switch (jobItemStatus) {
      case jobItemDetailsConstant.success:
        return this.renderJobItemSuccess()
      case jobItemDetailsConstant.failure:
        return this.renderJobItemFailure()
      case jobItemDetailsConstant.inProgress:
        return this.renderJobItemLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderPage()}
      </>
    )
  }
}
export default JobItemDetails

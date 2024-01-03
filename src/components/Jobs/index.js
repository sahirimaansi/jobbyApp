import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobCardItem from '../JobCardItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const jobsStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    search: '',
    employmentType: [],
    salaryRange: '',
    profileStatus: profileStatusConstants.initial,
    jobsStatus: jobsStatusConstants.initial,
    jobsList: [],
    profileDetails: {},
  }

  componentDidMount() {
    this.getProfileApi()
    this.getJobsApi()
  }

  getProfileApi = async () => {
    this.setState({profileStatus: profileStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const profileOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const responseProfile = await fetch(profileUrl, profileOptions)
    if (responseProfile.ok === true) {
      const profileData = await responseProfile.json()
      const updatedProfileData = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profileStatus: profileStatusConstants.success,
        profileDetails: updatedProfileData,
      })
    } else {
      this.setState({profileStatus: profileStatusConstants.failure})
    }
  }

  getJobsApi = async () => {
    this.setState({jobsStatus: jobsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {search, salaryRange, employmentType} = this.state
    const employmentString = employmentType.join()
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentString}&minimum_package=${salaryRange}&search=${search}`
    const jobsOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const jobsResponse = await fetch(jobsUrl, jobsOptions)
    if (jobsResponse.ok === true) {
      const jobsData = await jobsResponse.json()
      const updatedJobsList = jobsData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedJobsList,
        jobsStatus: jobsStatusConstants.success,
      })
    } else {
      this.setState({jobsStatus: jobsStatusConstants.failure})
    }
  }

  enterSearch = e => {
    if (e.key === 'Enter') {
      this.setState({search: e.target.value})
    }
  }

  onSearch = () => {
    this.getJobsApi()
  }

  renderProfileSuccessfully = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-background">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="profile-failure-container">
      <button
        className="retry-button"
        type="button"
        onClick={this.getProfileApi}
      >
        Retry
      </button>
    </div>
  )

  renderProfileLoading = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {profileStatus} = this.state

    switch (profileStatus) {
      case profileStatusConstants.success:
        return this.renderProfileSuccessfully()
      case profileStatusConstants.failure:
        return this.renderProfileFailure()
      case profileStatusConstants.inProgress:
        return this.renderProfileLoading()
      default:
        return null
    }
  }

  renderEmployeeTypeList = () => {
    const {employmentType} = this.state

    return (
      <>
        {employmentTypesList.map(eachEmployee => {
          const handleTypes = e => {
            if (e.target.checked) {
              this.setState(
                {
                  employmentType: [
                    ...employmentType,
                    eachEmployee.employmentTypeId,
                  ],
                },
                this.getJobsApi,
              )
            } else {
              const checkedList = employmentType.filter(
                eachType => eachType !== eachEmployee.employmentTypeId,
              )
              this.setState({employmentType: checkedList}, this.getJobsApi)
            }
          }
          return (
            <li className="employee-item" key={eachEmployee.employmentTypeId}>
              <input
                type="checkbox"
                id={eachEmployee.employmentTypeId}
                onChange={handleTypes}
              />
              <label
                htmlFor={eachEmployee.employmentTypeId}
                className="employee-label"
              >
                {eachEmployee.label}
              </label>
            </li>
          )
        })}
      </>
    )
  }

  renderEmployeeType = () => (
    <div className="employee-container">
      <h1 className="employee-heading">Type of Employment</h1>
      <ul className="employee-type-list">{this.renderEmployeeTypeList()}</ul>
    </div>
  )

  renderSalaryRangeList = () => (
    <>
      {salaryRangesList.map(eachRange => {
        const changeRadio = e => {
          this.setState({salaryRange: e.target.value}, this.getJobsApi)
        }
        return (
          <li className="employee-item" key={eachRange.salaryRangeId}>
            <input
              type="radio"
              name="salary"
              value={eachRange.salaryRangeId}
              onChange={changeRadio}
              id={eachRange.salaryRangeId}
            />
            <label htmlFor={eachRange.salaryRangeId} className="employee-label">
              {eachRange.label}
            </label>
          </li>
        )
      })}
    </>
  )

  renderSalaryRange = () => (
    <div className="employee-container">
      <h1 className="employee-heading">Salary Range</h1>
      <ul className="employee-type-list">{this.renderSalaryRangeList()}</ul>
    </div>
  )

  renderJobsSuccess = () => {
    const {jobsList} = this.state
    const isEmpty = jobsList.length === 0

    return (
      <>
        {isEmpty && (
          <div className="no-jobs-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="no-jobs-img"
            />
            <h1 className="no-jobs-heading">No Jobs Found</h1>
            <p className="no-jobs-para">
              We could not find any jobs. Try other filters
            </p>
          </div>
        )}
        {!isEmpty && (
          <div className="jobs-list-container">
            <ul className="jobs-list">
              {jobsList.map(eachJob => (
                <JobCardItem key={eachJob.id} jobDetails={eachJob} />
              ))}
            </ul>
          </div>
        )}
      </>
    )
  }

  renderJobsFailure = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retry-button" type="button" onClick={this.getJobsApi}>
        Retry
      </button>
    </div>
  )

  renderJobsLoading = () => (
    <div className="no-jobs-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobs = () => {
    const {jobsStatus} = this.state

    switch (jobsStatus) {
      case jobsStatusConstants.success:
        return this.renderJobsSuccess()
      case jobsStatusConstants.inProgress:
        return this.renderJobsLoading()
      case jobsStatusConstants.failure:
        return this.renderJobsFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="input-search-container-sm">
            <input
              type="search"
              className="search-input"
              placeholder="Search"
              onKeyDown={this.enterSearch}
            />
            <button
              type="button"
              className="search-icon-button"
              data-testid="searchButton"
              onClick={this.onSearch}
            >
              .<BsSearch className="search-icon" />
            </button>
          </div>
          <div className="inputs-container">
            {this.renderProfile()}
            <hr className="line" />
            {this.renderEmployeeType()}
            <hr className="line" />
            {this.renderSalaryRange()}
          </div>
          <div className="input-jobs-container">
            <div className="input-search-container-lg">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                onKeyDown={this.enterSearch}
              />
              <button
                type="button"
                className="search-icon-button"
                data-testid="searchButton"
                onClick={this.onSearch}
              >
                .<BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage('Checkout SCM') {
            steps {
                git branch:'main', url:'https://github.com/nevermyuk/sample-docker.git'
            }
        }

        stage('OWASP DependencyCheck') {
            steps {
                dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'Default'
            }
        }

        stage('Code Quality Check via SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=OWASP -Dsonar.sources=. -Dsonar.host.url=http://sonarqube:9000 -Dsonar.login=sqp_f5e5a4dfde0dd090c532ffeec7973644f007845a"
                    }
                }
            }
        }

        stage('Unit Test') {
            agent {
				docker {
							image 'node:16-alpine'
				}
			}
            steps {
                sh '''
                    cd sample-express
                    npm install
                    npm run test
                '''
            }
            post{
                always {
                    junit checksName: 'Jest Tests', testResults: 'sample-express/junit.xml'
                }
            }
        }
    }
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
        always {
                        recordIssues enabledForFailure: true, tools: [sonarQube()]
        }

    }
}

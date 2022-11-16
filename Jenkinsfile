pipeline {
    agent any
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
            always {
                junit checksName: 'Jest Tests', testResults: 'sample-express/junit.xml'
            }
        }
    }
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
    }
}

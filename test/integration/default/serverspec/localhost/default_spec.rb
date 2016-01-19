require 'spec_helper'

describe 'ansible-autodeploy::default' do
  describe file('/data/deployment/deploy.pub') do
    it { should exist }
  end

  describe file('/data/deployment/deploy.key') do
    it { should exist }
  end
end

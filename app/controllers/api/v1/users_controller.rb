module Api
    module V1
        class UsersController < ApplicationController
            protect_from_forgery prepend: true

            def index
                users = User.order('created_at DESC')
                render json: {status: true, message: 'Loaded Users', data:users, 'env': ENV["GMAIL_USERNAME"]}, status: :ok
            end

            def show
                begin
                    user = User.find(params[:id])
                    render json: {status: true, message: 'Loaded User', data:user}, status: :ok
                rescue => e
                    render json: {status: false, message: e.message}, status: :bad_request
                end
            end

            def create
                user = User.new(user_params)
                if user.save
                    render json: {status: true, message: 'Saved User', data:user}, status: :ok
                else
                    render json: {status: false, message: user.errors}, status: :bad_request
                end
            end

            def destroy
                user = User.find(params[:id])
                user.destroy
                render json: {status: true, message: 'Deleted User', data:user}, status: :ok
            end

            def update
                user = User.find(params[:id])
                if user.update(user_params)
                    render json: {status: true, message: 'Updated User', data:user}, status: :ok
                else
                    render json: {status: false, message: user.errors}, status: :bad_request
                end
            end

            private
                def user_params
                    params.permit(:name, :email, :title, :phone, :status)
                end
        end
    end
end
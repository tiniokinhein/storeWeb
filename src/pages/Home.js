import React, { Component } from 'react'
import Banners from '../components/products/Banners'
import Layout from '../components/layout/Layout'
import GridCategory from '../components/products/category/GridCategory'
import GridBrand from '../components/brands/GridBrand'
import GridSubCategory from '../components/products/subcategory/GridSubCategory'
import NewProducts from '../components/products/NewProducts'
import Views from '../components/views/Views'
import TwoGrids from '../components/feature/TwoGrids'
import OneGrid from '../components/feature/OneGrid'

class Home extends Component 
{
    render() {

        return (
            <Layout>
                <Banners />
                <div className="bg-light-custom">
                    <GridCategory />
                    <GridBrand />
                    <OneGrid />
                    <NewProducts />
                    <GridSubCategory />
                    <TwoGrids />
                    <Views />
                </div>
            </Layout>
        )
    }
}


export default Home
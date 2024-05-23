// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import { AppBar, Toolbar, Button, Typography, Grid, Paper, Tabs, Tab } from '@material-ui/core';

// const drawerWidth = 240;

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//   },
//   appBar: {
//     zIndex: theme.zIndex.drawer + 1,
//   },
//   appBarButton: {
//     marginRight: theme.spacing(2),
//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(3),
//   },
//   toolbar: theme.mixins.toolbar,
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   tabs: {
//     borderRight: `1px solid ${theme.palette.divider}`,
//   },
// }));

// const Template = () => {
//   const classes = useStyles();

//   const [tabValue, setTabValue] = React.useState(0);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   return (
//     <div className={classes.root}>
//       <AppBar position="fixed" className={classes.appBar}>
//         <Toolbar>
//           <Typography variant="h6" noWrap>
//             Your Website Name
//           </Typography>
//           <div style={{ flexGrow: 1 }} />
//           <Button className={classes.appBarButton} color="inherit">Button 1</Button>
//           <Button className={classes.appBarButton} color="inherit">Button 2</Button>
//           <Button className={classes.appBarButton} color="inherit">Button 3</Button>
//         </Toolbar>
//       </AppBar>
//       <Grid container>
//         <Grid item xs={3}>
//           <Paper className={classes.drawer}>
//             <Tabs
//               orientation="vertical"
//               variant="scrollable"
//               value={tabValue}
//               onChange={handleTabChange}
//               className={classes.tabs}
//             >
//               <Tab label="Tab 1" />
//               <Tab label="Tab 2" />
//               <Tab label="Tab 3" />
//               <Tab label="Tab 4" />
//             </Tabs>
//           </Paper>
//         </Grid>
//         <Grid item xs={9}>
//           <main className={classes.content}>
//             <div className={classes.toolbar} />
//             {/* Your main content here */}
//             <Typography paragraph>
//               Main Content
//             </Typography>
//           </main>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default Template;
